import { DialogButton } from 'shared/app-views/dialog/dialog.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { CategoryTemplates } from 'shared/constants/templates.constants';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { EditorComponent } from 'shared/components/editor/editor.component';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ThreadControllerActions, ThreadSkeleton } from './thread-controller.model';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { Breadcrumb, BreadcrumbItem } from 'core/services/breadcrum/breadcrum.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { AutoSaveHelper } from 'shared/helpers/auto-save.helper';
import { AutoSave } from '../../forum.model';
import { ThreadAnswer, ThreadPoll } from '../../thread/thread-poll/thread-poll.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { FORUM_BREADCRUM_ITEM } from '../../forum.constants';
import { ContentTab } from 'shared/app-views/content-tabs/content-tabs.model';

@Component({
    selector: 'app-forum-thread-controller',
    templateUrl: 'thread-controller.component.html',
    styleUrls: [ 'thread-controller.component.css' ]
})

export class ThreadControllerComponent extends Page implements OnDestroy {
    private _data: ThreadSkeleton = new ThreadSkeleton();
    thumbnailLoaded;

    @ViewChild('editor', { static: true }) editor: EditorComponent;
    @ViewChild('file') fileInput;

    tabs: Array<TitleTab> = [];
    badgeCodes = '';
    badges: Array<string> = [];

    contentTabs: Array<ContentTab> = [];
    sections = {
        details: true,
        poll: false,
        quest: false,
        thumbnail: false
    };

    constructor (
        private _dialogService: DialogService,
        private _httpClient: HttpClient,
        private _router: Router,
        private _notificationService: NotificationService,
        private _breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    removeAnswer (answerId: string): void {
        this._data.poll.answers = this._data.poll.answers
            .filter(answer => answer.id !== answerId);
    }

    onTabClick (action: number): void {
        switch (action) {
            case ThreadControllerActions.BACK:
                if (this.isNew) {
                    this._router.navigateByUrl(`/forum/category/${this._data.categoryId}/page/1`);
                } else {
                    this._router.navigateByUrl(`/forum/thread/${this._data.threadId}/page/1`);
                }
                break;
            case ThreadControllerActions.SAVE:
                this.onSave();
                break;
            case ThreadControllerActions.AUTO_SAVE:
                this.onOpenAutoSave();
                break;
            case ThreadControllerActions.TOGGLE_POLL:
                this.onPollToggle();
                break;
        }
    }

    haveTag (tag: string): boolean {
        return this._data.tags.indexOf(tag) > -1;
    }

    toggleTag ($event, tag: string): void {
        $event.preventDefault();

        if (this.haveTag(tag)) {
            this._data.tags = this._data.tags.filter(t => t !== tag);
        } else {
            this._data.tags.push(tag);
        }
    }

    onBadgeCodesChange () {
        this.badges = [];
        this.badges = this.badgeCodes.split(',').map(code => code.trim());
    }

    onKeyUp (content: string): void {
        AutoSaveHelper.save({
            title: this.thread.title,
            content: content,
            type: AutoSave.THREAD,
            contentId: this._data.categoryId
        });
    }

    onPollToggle (): void {
        this._data.poll = !this._data.poll ? new ThreadPoll({ isNew: true }) : null;
        if (this._data.poll) {
            this.addThreadAnswer();
            this.addThreadAnswer();
        }
    }

    addThreadAnswer (): void {
        this._data.poll.answers.push(new ThreadAnswer());
    }

    onSave (): void {
        this._data.content = this.editor.getEditorValue();
        const form = new FormData();
        if (this._data.template === CategoryTemplates.QUEST && this.fileInput.nativeElement.files) {
            const file = this.fileInput.nativeElement.files[0];
            form.append('thumbnail', file);
        }
        this._data.badges = this.badges;
        form.append('thread', JSON.stringify(this._data));
        if (!this.isNew) {
            this._httpClient.post(`api/forum/thread/update/${this._data.threadId}`, form)
                .subscribe(res => {
                    this.onSuccessUpdate(res);
                }, error => {
                    this._notificationService.failureNotification(error);
                });
        } else {
            this._httpClient.post('api/forum/thread', form)
                .subscribe((res: { threadId: number, isApproved: boolean }) => {
                    this.onSuccessCreate(res);
                }, error => {
                    this._notificationService.failureNotification(error);
                });
        }
    }

    onContentTabClick (item: ContentTab): void {
        Object.keys(this.sections).forEach(key => this.sections[key] = false);
        this.sections[item.label.toLowerCase()] = true;
    }

    get thread (): ThreadSkeleton {
        return this._data;
    }

    get pageTitle (): string {
        return !this.isNew ?
            `Edit Thread: ${this._data.title}` :
            `Creating New Thread: ${this._data.title}`;
    }

    get isNew (): boolean {
        return !Boolean(this._data && this._data.createdAt);
    }

    get shouldHaveThumbnail (): boolean {
        return CategoryTemplates.QUEST === this._data.template;
    }

    get isQuestTemplate (): boolean {
        return CategoryTemplates.QUEST === this._data.template;
    }

    get thumbnailUrl (): string {
        return `/resources/images/thumbnails/${this._data.threadId}.gif`;
    }

    private onOpenAutoSave (): void {
        const autoSave = AutoSaveHelper.get(AutoSave.THREAD, this._data.categoryId);
        this.thread.title = autoSave.title;
        this.editor.content = autoSave.content;
        AutoSaveHelper.remove(AutoSave.THREAD, this._data.categoryId);
        this.tabs = this.tabs.filter(button => button.value !== ThreadControllerActions.AUTO_SAVE);
    }

    private onData (data: { data: ThreadSkeleton }): void {
        this._data = data.data;
        this.badgeCodes = this._data.badges.join(',');
        this.badges = this._data.badges;
        this.setPrefix();
        this.setBreadcrumb();

        this.tabs = [
            new TitleTab({ title: data.data.createdAt ? 'Save' : 'Create', value: ThreadControllerActions.SAVE }),
            new TitleTab({ title: 'Back', value: ThreadControllerActions.BACK }),
            new TitleTab({ title: 'Toggle Poll', value: ThreadControllerActions.TOGGLE_POLL })
        ];

        this.contentTabs = [
            { label: 'Details', isActive: true, condition: true },
            { label: 'Poll', isActive: false, condition: this._data.canHavePoll },
            { label: 'Quest', isActive: false, condition: this.isQuestTemplate },
            { label: 'Thumbnail', isActive: false, condition: this.isQuestTemplate }
        ].filter(item => item.condition)
            .map(item => new ContentTab(item.label, item.isActive));

        if (this._data.poll || !this._data.canHavePoll) {
            this.tabs = this.tabs.filter(button => button.value !== ThreadControllerActions.TOGGLE_POLL);
        }

        if (AutoSaveHelper.exists(AutoSave.THREAD, this._data.categoryId)) {
            this.tabs.push(new TitleTab({
                title: 'Open Auto-Save',
                value: ThreadControllerActions.AUTO_SAVE
            }));
        }
    }

    private setBreadcrumb (): void {
        const threadCrumb = this.isNew ? [] : [ new BreadcrumbItem({
            title: this._data.title,
            url: `/forum/thread/${this._data.threadId}/page/1`
        }) ];

        this._data.parents.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'displayOrder'));
        this._breadcrumbService.breadcrumb = new Breadcrumb({
            current: this._data.threadId > 0 ? 'Editing' : 'New',
            items: [ FORUM_BREADCRUM_ITEM ].concat(this._data.parents.map(parent => new BreadcrumbItem({
                title: parent.title,
                url: `/forum/category/${parent.categoryId}/page/1`
            })).concat(threadCrumb))
        });
    }

    private setPrefix (): void {
        this._data.prefixId =
            this._data.prefixes.findIndex(prefix => prefix.prefixId === this._data.prefixId) > -1 ?
                this._data.prefixId : 0;
    }

    private onSuccessUpdate (res): void {
        this._data = new ThreadSkeleton(res);
        AutoSaveHelper.remove(AutoSave.THREAD, this._data.categoryId);
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success!',
            message: 'Thread is updated!'
        }));
    }

    private onSuccessCreate (data: { threadId: number, isApproved: boolean }): void {
        AutoSaveHelper.remove(AutoSave.THREAD, this._data.categoryId);
        if (!data.isApproved) {
            this._dialogService.openDialog({
                title: 'You thread is currently awaiting approval!',
                content: `Your thread is placed under the category of "unapproved" threads,
                    and it await approval from the Moderators before being visible!`,
                buttons: [
                    new DialogButton({
                        title: 'Ok', callback: () => {
                            this._dialogService.closeDialog();
                            this._router.navigateByUrl(`/forum/category/${this._data.categoryId}/page/1`);
                        }
                    })
                ]
            });
        } else {
            this._router.navigateByUrl(`/forum/thread/${data.threadId}/page/1`);
        }
    }
}
