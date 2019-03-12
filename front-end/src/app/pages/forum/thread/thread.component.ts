import { DialogService } from 'core/services/dialog/dialog.service';
import { FixedToolItem, FixedTools } from 'shared/components/fixed-tools/fixed-tools.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { AutoSave, ForumPermissions } from '../forum.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { EditorComponent } from 'shared/components/editor/editor.component';
import { HttpService } from 'core/services/http/http.service';
import { AuthService } from 'core/services/auth/auth.service';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { PostModel } from '../post/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { getPostTools, getThreadTools, ThreadActions, ThreadPage } from './thread.model';
import { Component, ComponentFactoryResolver, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { EditorAction } from 'shared/components/editor/editor.model';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { Breadcrumb, BreadcrumbItem } from 'core/services/breadcrum/breadcrum.model';
import { FORUM_BREADCRUM_ITEM } from '../forum.constants';
import { DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { Button } from 'shared/directives/button/button.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { AutoSaveHelper } from 'shared/helpers/auto-save.helper';
import { ThreadService } from '../services/thread.service';
import { ThreadActionExecutor } from './thread.helper';

@Component({
    selector: 'app-forum-thread',
    templateUrl: 'thread.component.html',
    styleUrls: ['thread.component.css']
})

export class ThreadComponent extends Page implements OnDestroy {
    private _threadPage: ThreadPage = new ThreadPage();
    private _isToolsVisible = false;

    @ViewChild('editor') editor: EditorComponent;

    fixedTools: FixedTools;
    pagination: PaginationModel;
    editorButtons: Array<EditorAction> = [];

    tabs: Array<TitleTab> = [];

    constructor(
        private _dialogService: DialogService,
        private _httpService: HttpService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _router: Router,
        private _globalNotificationService: GlobalNotificationService,
        private _elementRef: ElementRef,
        private _breadcrumbService: BreadcrumbService,
        private _componentFactory: ComponentFactoryResolver,
        private _service: ThreadService
    ) {
        super(_elementRef);
        this.addSubscription(this._activatedRoute.data, this.onThread.bind(this));
    }

    trackPosts(_index: number, item: PostModel): number {
        return item.updatedAt;
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onKeyUp(content: string): void {
        if (!content) {
            return;
        }

        AutoSaveHelper.save({
            type: AutoSave.POST,
            contentId: this._threadPage.threadId,
            content: content
        });
    }

    onButtonClick(button: EditorAction): void {
        switch (button.value) {
            case ThreadActions.AUTO_SAVE:
                this.onOpenAutoSave();
                break;
            case ThreadActions.POST_CLOSE:
            case ThreadActions.POST_OPEN:
                this.doPost(true);
                break;
            case ThreadActions.POST:
                this.doPost(false);
                break;
        }
    }

    onAction(action: number): void {
        ThreadActionExecutor.newBuilder()
            .withAction(action)
            .withGlobalNotificationService(this._globalNotificationService)
            .withComponentFactory(this._componentFactory)
            .withDialogService(this._dialogService)
            .withHttpService(this._httpService)
            .withThreadPage(this._threadPage)
            .withRouter(this._router)
            .withBuildModerationTools(this.buildModerationTools.bind(this))
            .execute();
    }

    onUpdatePost(postModel: PostModel): void {
        this._httpService.put(`forum/thread/post/${postModel.postId}`, { post: postModel })
            .subscribe(this.onSuccessUpdate.bind(this),
                this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    onQuotePost(content: string): void {
        const editorValue = this.editor.getEditorValue();
        this.editor.content = editorValue.length > 0 ? `${editorValue}${content}` : content;
        this.onKeyUp(this.editor.getEditorValue());
        this.scrollToEditor();
    }

    getPostTitle(post: PostModel, index: number): string {
        let title = TimeHelper.getLongDateWithTime(post.createdAt);

        if (!post.isApproved) {
            title += ' | unapproved';
        }
        return `#${this._threadPage.page * (index + 1)} - ${title}`;
    }

    onTabClick(action: number): void {
        switch (action) {
            case ThreadActions.SUBSCRIBE:
            case ThreadActions.UNSUBSCRIBE:
                this.onSubscribeToggle();
                break;
            case ThreadActions.IGNORE:
            case ThreadActions.UNIGNORE:
                this.onIgnoreToggle();
                break;
            case ThreadActions.TOGGLE_TOOLS:
                this._isToolsVisible = !this._isToolsVisible;
                this.buildModerationTools();
                break;
        }
    }

    onIgnoreToggle(): void {
        this._service.toggleIgnore(this._threadPage)
            .subscribe(isIgnored => {
                this._threadPage.isIgnored = isIgnored;
                this.createOrUpdateTabs();
            });
    }

    onSubscribeToggle(): void {
        this._service.toggleSubscription(this._threadPage)
            .subscribe(isSubscribed => {
                this._threadPage.isSubscribed = isSubscribed;
                this.createOrUpdateTabs();
            });
    }

    get canPost(): boolean {
        return this._authService.isLoggedIn() &&
            (this._threadPage.isOpen || this._threadPage.forumPermissions.canCloseOpenThread) &&
            this._threadPage.categoryIsOpen;
    }

    get cantPostReason(): string {
        if (!this._authService.isLoggedIn()) {
            return 'You need to be logged in to post';
        } else if (!this._threadPage.isOpen) {
            return 'Thread is closed';
        } else if (!this._threadPage.categoryIsOpen) {
            return 'The category is closed';
        }
        return '';
    }

    get posts(): Array<PostModel> {
        return this._threadPage.threadPosts.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'postId'));
    }

    get subTitle(): string {
        return this._threadPage.isOpen ? '' : 'Thread is closed';
    }

    get forumPermissions(): ForumPermissions {
        return this._threadPage.forumPermissions;
    }

    get thread(): ThreadPage {
        return this._threadPage;
    }

    private doPost(toggleThread: boolean): void {
        const threadId = this._threadPage ? this._threadPage.threadId : 0;
        const content = this.editor ? this.editor.getEditorValue() : '';

        this._httpService.post(`forum/thread/${threadId}`, { content: content, toggleThread: toggleThread })
            .subscribe(this.onSuccessPost.bind(this, toggleThread),
                this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onOpenAutoSave(): void {
        const autoSave = AutoSaveHelper.get(AutoSave.POST, this._threadPage.threadId);
        this.editor.content = autoSave.content;
        AutoSaveHelper.remove(AutoSave.POST, this._threadPage.threadId);
        this.editorButtons = this.editorButtons.filter(button => button.value !== ThreadActions.AUTO_SAVE);
    }

    private scrollToEditor(): void {
        const elements = this._elementRef.nativeElement.getElementsByClassName('new-post-editor');
        if (elements.length > 0) {
            const top = elements[elements.length - 1].offsetTop;
            window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
        }
    }

    private onSuccessUpdate(postModel: PostModel): void {
        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
            title: 'Success',
            message: 'Post updated!'
        }));
        this._threadPage.threadPosts = this._threadPage.threadPosts.map(post => {
            return post.postId === postModel.postId ? new PostModel(postModel) : post;
        });
    }

    private onSuccessPost(toggleThread: boolean, post: PostModel): void {
        this.editor.content = '';
        AutoSaveHelper.remove(AutoSave.POST, this._threadPage.threadId);
        if (this._threadPage.contentApproval) {
            this._dialogService.openDialog({
                title: 'You post is awaiting approval',
                content: `Your post is placed under the category of "unapproved" posts,
                    it will be waiting approval from a moderator before visible`,
                buttons: [new DialogCloseButton('Close')]
            });
        } else {
            if (this._threadPage.page < this._threadPage.total) {
                const url = `/forum/thread/${this._threadPage.threadId}/page/${this._threadPage.total}?scrollTo=post-${post.postId}`;
                this._router.navigateByUrl(url);
            } else {
                this._threadPage.threadPosts.push(new PostModel(post));
                this._threadPage.isOpen = toggleThread ? !this._threadPage.isOpen : this._threadPage.isOpen;
                this.buildEditorButtons();
            }
        }
    }

    private onThread(data: { data: ThreadPage }): void {
        this._threadPage = data.data;
        this.pagination = new PaginationModel({
            total: this._threadPage.total,
            page: this._threadPage.page,
            url: `/forum/thread/${this._threadPage.threadId}/page/:page`
        });
        this.setPrefix();
        this.createOrUpdateTabs();

        if (this._authService.isLoggedIn()) {
            this.buildEditorButtons();
            this.buildModerationTools();
        }
    }

    private createOrUpdateTabs(): void {
        if (!this._authService.isLoggedIn()) {
            this.tabs = [];
            return;
        }
        this.tabs = [
            new TitleTab({
                title: this._threadPage.isSubscribed ? 'Unsubscribe' : 'Subscribe',
                value: this._threadPage.isSubscribed ? ThreadActions.UNSUBSCRIBE : ThreadActions.SUBSCRIBE
            }),
            new TitleTab({
                title: this._threadPage.isIgnored ? 'Un-ignore' : 'Ignore',
                value: this._threadPage.isIgnored ? ThreadActions.UNIGNORE : ThreadActions.IGNORE
            }),
        ];

        if (this.haveAnyTools()) {
            this.tabs.push(new TitleTab({
                title: 'Toggle Tools',
                value: ThreadActions.TOGGLE_TOOLS
            }));
        }
    }

    private setPrefix(): void {
        if (!this._threadPage || !this._threadPage.title) {
            return;
        }
        const prefix = this._threadPage.prefix ?
            `<span style="${this._threadPage.prefix.style}">${this._threadPage.prefix.text} &#xbb;</span>` : '';

        const title = this._threadPage.title.replace('<', '&#60;').replace('>', '&#62;');

        this._breadcrumbService.breadcrumb = new Breadcrumb({
            current: `${prefix} ${title}`,
            items: [FORUM_BREADCRUM_ITEM].concat(this._threadPage.parents.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'displayOrder'))
                .map(parent => new BreadcrumbItem({
                    title: parent.title,
                    url: `/forum/category/${parent.categoryId}/page/1`
                })))
        });
    }

    private buildModerationTools(): void {
        if (!this._isToolsVisible) {
            this.fixedTools = null;
            return;
        }

        this.fixedTools = new FixedTools({
            items: [
                new FixedToolItem({
                    title: 'Post Tools',
                    children: getPostTools(this.forumPermissions).filter(action => action.condition)
                        .map(action => new FixedToolItem({ title: action.title, value: action.value }))
                }),
                new FixedToolItem({
                    title: 'Thread Tools',
                    children: getThreadTools(this._authService.authUser.userId, this._threadPage, this.forumPermissions)
                        .filter(action => action.condition)
                        .map(action => new FixedToolItem({ title: action.title, value: action.value }))
                })
            ]
        });
    }

    private haveAnyTools(): boolean {
        return getPostTools(this.forumPermissions).filter(item => item.condition).length > 0 ||
            getThreadTools(this._authService.authUser.userId, this._threadPage, this.forumPermissions)
                .filter(item => item.condition).length > 0;
    }

    private buildEditorButtons(): void {
        const buttons = [
            new EditorAction({
                title: 'Post',
                value: ThreadActions.POST,
                saveCallback: this.onButtonClick.bind(this, { value: ThreadActions.POST })
            }),
            new EditorAction({ title: 'Post', value: ThreadActions.POST, asButton: true, buttonColor: Button.BLUE })
        ];

        if (this._threadPage.forumPermissions.canCloseOpenThread && this._threadPage.isOpen) {
            buttons.push(new EditorAction({ title: 'Post & Close Thread', value: ThreadActions.POST_CLOSE }));
            buttons.push(new EditorAction({
                title: 'Post & Close Thread',
                value: ThreadActions.POST_CLOSE,
                asButton: true,
                buttonColor: Button.GREEN
            }));
        } else if (this._threadPage.forumPermissions.canCloseOpenThread && !this._threadPage.isOpen) {
            buttons.push(new EditorAction({ title: 'Post & Open Thread', value: ThreadActions.POST_OPEN }));
            buttons.push(new EditorAction({
                title: 'Post & Open Thread',
                value: ThreadActions.POST_OPEN,
                asButton: true,
                buttonColor: Button.GREEN
            }));
        }

        if (AutoSaveHelper.exists(AutoSave.POST, this._threadPage.threadId)) {
            buttons.push(new EditorAction({
                title: 'Open auto-save',
                value: ThreadActions.AUTO_SAVE,
                asButton: true,
                buttonColor: Button.YELLOW
            }));
        }

        this.editorButtons = buttons;
    }
}
