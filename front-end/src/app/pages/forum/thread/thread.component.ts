import { DialogService } from 'core/services/dialog/dialog.service';
import { FixedToolItem, FixedTools } from 'shared/components/fixed-tools/fixed-tools.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { AutoSave, ForumPermissions } from '../forum.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { EditorComponent } from 'shared/components/editor/editor.component';
import { HttpService } from 'core/services/http/http.service';
import { AuthService } from 'core/services/auth/auth.service';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { PostModel } from '../post/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { getPostTools, getStatsBoxes, getThreadTools, ThreadActions, ThreadPage } from './thread.model';
import { Component, ComponentFactoryResolver, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { EditorAction } from 'shared/components/editor/editor.model';
import { Breadcrumb, BreadcrumbItem } from 'core/services/breadcrum/breadcrum.model';
import { FORUM_BREADCRUM_ITEM } from '../forum.constants';
import { DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { TitleTab } from 'shared/app-views/title/title.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { AutoSaveHelper } from 'shared/helpers/auto-save.helper';
import { ThreadService } from '../services/thread.service';
import { ThreadActionExecutor } from './thread.helper';
import { ThreadPostersComponent } from './thread-posters/thread-posters.component';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';

@Component({
    selector: 'app-forum-thread',
    templateUrl: 'thread.component.html',
    styleUrls: [ 'thread.component.css' ]
})
export class ThreadComponent extends Page implements OnDestroy {
    private _threadPage = new ThreadPage();
    private _isToolsVisible = false;
    private _multiQuotedPosts: Array<PostModel> = [];
    private _quoteRegex = /\[quotepost([\s\S]*)quotepost\]/g;

    @ViewChild('editor') editor: EditorComponent;

    isMiniProfileDisabled = false;
    fixedTools: FixedTools;
    pagination: PaginationModel;
    editorButtons: Array<EditorAction> = [];

    tabs: Array<TitleTab> = [];
    stats: Array<StatsBoxModel> = [];
    closedThread: InfoBoxModel = {
        type: INFO_BOX_TYPE.WARNING,
        title: 'Thread Closed',
        content: 'The thread is closed'
    };
    threadBanned: InfoBoxModel = {
        type: INFO_BOX_TYPE.WARNING,
        title: 'You are banned',
        content: 'You are banned from viewing this thread'
    };

    constructor (
        private _dialogService: DialogService,
        private _httpService: HttpService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _router: Router,
        private _notificationService: NotificationService,
        private _elementRef: ElementRef,
        private _breadcrumbService: BreadcrumbService,
        private _componentFactory: ComponentFactoryResolver,
        private _service: ThreadService
    ) {
        super(_elementRef);
        this._isToolsVisible = Boolean(localStorage.getItem(LOCAL_STORAGE.FORUM_TOOLS));
        this.isMiniProfileDisabled = Boolean(localStorage.getItem(LOCAL_STORAGE.MINI_PROFILE_DISABLED));
        this.addSubscription(this._activatedRoute.data, this.onData.bind(this));
        this._multiQuotedPosts = [];
    }

    trackPosts (_index: number, item: PostModel): number {
        return item.updatedAt;
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onKeyUp (content: string): void {
        if (!content) {
            return;
        }

        AutoSaveHelper.save({
            type: AutoSave.POST,
            contentId: this._threadPage.threadId,
            content: content
        });
    }

    onButtonClick (button: EditorAction): void {
        switch (button.value) {
            case ThreadActions.AUTO_SAVE:
                this.onOpenAutoSave();
                break;
            case ThreadActions.POST_CLOSE:
            case ThreadActions.POST_OPEN:
                this._dialogService.confirm({
                    title: 'Are you sure?',
                    content: `Are you sure you wanna ${this._threadPage.isOpen ? 'close' : 'open'} this thread also?`,
                    callback: () => {
                        this._dialogService.closeDialog();
                        this.doPost(true);
                    }
                });
                break;
            case ThreadActions.POST:
                this.doPost(false);
                break;
        }
    }

    onAction (action: number): void {
        ThreadActionExecutor.newBuilder()
            .withAction(action)
            .withNotificationService(this._notificationService)
            .withComponentFactory(this._componentFactory)
            .withDialogService(this._dialogService)
            .withHttpService(this._httpService)
            .withThreadPage(this._threadPage)
            .withRouter(this._router)
            .withBuildModerationTools(this.buildModerationTools.bind(this))
            .execute();
    }

    onUpdatePost (postModel: PostModel): void {
        this._service.updatePost(postModel)
            .subscribe(updatedModel => {
                this._threadPage.threadPosts = this._threadPage.threadPosts.map(post => {
                    return post.postId === updatedModel.postId ? updatedModel : post;
                });
            });
    }

    onQuotePost (content: string): void {
        const editorValue = this.editor.getEditorValue();

        const quotes = this._multiQuotedPosts.reduce((prev, curr) => {
            const postContent = curr.content.replace(this._quoteRegex, '');
            return prev + `[quotepost=${curr.postId}]Originally Posted by [b]${curr.user.nickname}[/b]
${postContent}[/quotepost]\n\r`;
        }, '');
        this.editor.content = editorValue.length > 0 ?
            `${editorValue}${quotes}${content}` : `${quotes}${content}`;
        this.onKeyUp(this.editor.getEditorValue());
        this.scrollToEditor();
        this._multiQuotedPosts = [];
    }

    onMultiQuotePost (post: PostModel): void {
        if (this._multiQuotedPosts.findIndex(item => item.postId === post.postId) > -1) {
            this._multiQuotedPosts = this._multiQuotedPosts.filter(item => item.postId !== post.postId);
        } else {
            this._multiQuotedPosts.push(post);
        }
    }

    getPostTitle (post: PostModel, index: number): string {
        let title = TimeHelper.getLongDateWithTime(post.createdAt);

        if (!post.isApproved) {
            title += ' | unapproved';
        }
        if (index >= 9) {
            return `#${this._threadPage.page}${(index + 1) - 10} - ${title}`;
        } else if (this._threadPage.page > 1) {
            return `#${(this._threadPage.page - 1)}${index + 1} - ${title}`;
        }
        return `#${index + 1} - ${title}`;
    }

    onTabClick (action: number): void {
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
            case ThreadActions.THREAD_POSTERS:
                this.showThreadPosters();
                break;
        }
    }

    onIgnoreToggle (): void {
        this._service.toggleIgnore(this._threadPage)
            .subscribe(isIgnored => {
                this._threadPage.isIgnored = isIgnored;
                this.createOrUpdateTabs();
            });
    }

    onSubscribeToggle (): void {
        this._service.toggleSubscription(this._threadPage)
            .subscribe(isSubscribed => {
                this._threadPage.isSubscribed = isSubscribed;
                this.createOrUpdateTabs();
            });
    }

    onCheckboxChange (post: PostModel): void {
        post.isSelected = !post.isSelected;

        if (this.posts.some(item => item.isSelected)) {
            this._isToolsVisible = true;
            if (!this.fixedTools) {
                this.buildModerationTools();
            }
        } else {
            this._isToolsVisible = false;
            this.fixedTools = null;
        }
    }

    get canPost (): boolean {
        return this._authService.isLoggedIn() &&
            (this._threadPage.isOpen || this._threadPage.forumPermissions.canCloseOpenThread) &&
            this._threadPage.categoryIsOpen &&
            (this._threadPage.user.userId === this._authService.authUser.userId ||
                this._threadPage.forumPermissions.canPostInOthersThreads);
    }

    get cantPostReason (): string {
        if (!this._authService.isLoggedIn()) {
            return 'You need to be logged in to post!';
        } else if (!this._threadPage.isOpen) {
            return 'Thread is closed!';
        } else if (!this._threadPage.categoryIsOpen) {
            return 'The category is closed!';
        } else if (this._threadPage.user.userId !== this._authService.authUser.userId &&
            !this._threadPage.forumPermissions.canPostInOthersThreads) {
            return 'You can\'t post in other users threads';
        }
        return '';
    }

    get posts (): Array<PostModel> {
        return this._threadPage.threadPosts;
    }

    get forumPermissions (): ForumPermissions {
        return this._threadPage.forumPermissions;
    }

    get thread (): ThreadPage {
        return this._threadPage;
    }

    get currentReadersTitle (): string {
        return `${this._threadPage.currentReaders.length} Currently Viewing This Thread`;
    }

    private doPost (toggleThread: boolean): void {
        const threadId = this._threadPage ? this._threadPage.threadId : 0;
        const content = this.editor ? this.editor.getEditorValue() : '';
        this._service.createPost(threadId, content, toggleThread)
            .subscribe(post => this.onSuccessPost(toggleThread, post));
    }

    private onOpenAutoSave (): void {
        const autoSave = AutoSaveHelper.get(AutoSave.POST, this._threadPage.threadId);
        this.editor.content = autoSave.content;
        AutoSaveHelper.remove(AutoSave.POST, this._threadPage.threadId);
        this.editorButtons = this.editorButtons.filter(button => button.value !== ThreadActions.AUTO_SAVE);
    }

    private scrollToEditor (): void {
        const elements = this._elementRef.nativeElement.getElementsByClassName('new-post-editor');
        if (elements.length > 0) {
            const top = elements[elements.length - 1].offsetTop;
            window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
        }
    }

    private onSuccessPost (toggleThread: boolean, post: PostModel): void {
        this.editor.content = '';
        this._notificationService.sendInfoNotification('Your post has been created!');
        AutoSaveHelper.remove(AutoSave.POST, this._threadPage.threadId);
        if (!post.isApproved) {
            this._dialogService.openDialog({
                title: 'Your post is awaiting approval!',
                content: `Your post is placed under the category of "unapproved" posts,
                    it will be waiting approval from a moderator before it isvisible.`,
                buttons: [ new DialogCloseButton('Close') ]
            });
            return;
        }

        if (this._threadPage.page < this._threadPage.total) {
            const url = `/forum/thread/${this._threadPage.threadId}/page/${this._threadPage.total}?scrollTo=post-${post.postId}`;
            this._router.navigateByUrl(url);
        } else {
            this._threadPage.threadPosts.push(post);
            this._threadPage.isOpen = toggleThread ? !this._threadPage.isOpen : this._threadPage.isOpen;
            this.buildEditorButtons();
        }
    }

    private onData (data: { data: ThreadPage }): void {
        this._threadPage = data.data;
        this._threadPage.parents.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'displayOrder'));
        this._threadPage.threadPosts.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'postId'));
        const byUser = this._activatedRoute.params['postedByUser'] ? `/${this._activatedRoute.params['postedByUser']}` : '';
        this.pagination = new PaginationModel({
            total: this._threadPage.total,
            page: this._threadPage.page,
            url: `/forum/thread/${this._threadPage.threadId}/page/:page` + byUser
        });
        this.stats = getStatsBoxes(this._threadPage, this.onMarkBadge.bind(this));
        this.setPrefix();
        this.createOrUpdateTabs();

        if (this._authService.isLoggedIn()) {
            this.buildEditorButtons();
            this.buildModerationTools();
        }
    }

    private createOrUpdateTabs (): void {
        if (!this._authService.isLoggedIn()) {
            this.tabs = [];
            return;
        }
        this.tabs = [
            new TitleTab({
                title: 'Posters',
                value: ThreadActions.THREAD_POSTERS
            }),
            new TitleTab({
                title: this._threadPage.isSubscribed ? 'Unsubscribe' : 'Subscribe',
                value: this._threadPage.isSubscribed ? ThreadActions.UNSUBSCRIBE : ThreadActions.SUBSCRIBE
            }),
            new TitleTab({
                title: this._threadPage.isIgnored ? 'Unignore' : 'Ignore',
                value: this._threadPage.isIgnored ? ThreadActions.UNIGNORE : ThreadActions.IGNORE
            })
        ];

        if (this.haveAnyTools()) {
            this.tabs.push(new TitleTab({
                title: 'Toggle Tools',
                value: ThreadActions.TOGGLE_TOOLS
            }));
        }
    }

    private setPrefix (): void {
        if (!this._threadPage || !this._threadPage.title) {
            return;
        }
        const prefix = this._threadPage.prefix ?
            `<span style="${this._threadPage.prefix.style}">${this._threadPage.prefix.text} &#xbb;</span>` : '';

        const title = this._threadPage.title.replace('<', '&#60;').replace('>', '&#62;');

        this._breadcrumbService.breadcrumb = new Breadcrumb({
            current: `${prefix} ${title}`,
            items: [ FORUM_BREADCRUM_ITEM ].concat(this._threadPage.parents.map(parent => new BreadcrumbItem({
                title: parent.title,
                url: `/forum/category/${parent.categoryId}/page/1`
            })))
        });
    }

    private buildModerationTools (): void {
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

    private haveAnyTools (): boolean {
        return getPostTools(this.forumPermissions).filter(item => item.condition).length > 0 ||
            getThreadTools(this._authService.authUser.userId, this._threadPage, this.forumPermissions)
                .filter(item => item.condition).length > 0;
    }

    private buildEditorButtons (): void {
        const buttons = [
            new EditorAction({
                title: 'Post',
                value: ThreadActions.POST,
                saveCallback: this.onButtonClick.bind(this, { value: ThreadActions.POST })
            })
        ];

        if (this._threadPage.forumPermissions.canCloseOpenThread && this._threadPage.isOpen) {
            buttons.push(new EditorAction({
                title: 'Post & Close Thread',
                value: ThreadActions.POST_CLOSE
            }));
        } else if (this._threadPage.forumPermissions.canCloseOpenThread && !this._threadPage.isOpen) {
            buttons.push(new EditorAction({
                title: 'Post & Open Thread',
                value: ThreadActions.POST_OPEN
            }));
        }

        if (AutoSaveHelper.exists(AutoSave.POST, this._threadPage.threadId)) {
            buttons.push(new EditorAction({
                title: 'Open Auto-Save',
                value: ThreadActions.AUTO_SAVE
            }));
        }

        this.editorButtons = buttons;
    }

    private onMarkBadge (): void {
        this._service.markBadgeCompleted(this._threadPage.badges).subscribe(() => {
            this._notificationService.sendInfoNotification('Badge(s) completed!');
            this._threadPage.isBadgesCompleted = true;
            this.stats = getStatsBoxes(this.thread, this.onMarkBadge.bind(this));
        });
    }

    private showThreadPosters (): void {
        this._dialogService.openDialog({
            title: 'Thread Posters',
            buttons: [
                new DialogCloseButton('Close')
            ],
            data: this._threadPage.threadId,
            component: this._componentFactory.resolveComponentFactory(ThreadPostersComponent)
        });
    }
}
