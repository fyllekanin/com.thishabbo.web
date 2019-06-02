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

@Component({
    selector: 'app-forum-thread-controller',
    templateUrl: 'thread-controller.component.html',
    styleUrls: ['thread-controller.component.css']
})

export class ThreadControllerComponent extends Page implements OnDestroy {
    private _threadSkeleton: ThreadSkeleton = new ThreadSkeleton();

    @ViewChild('editor', {static: true}) editor: EditorComponent;
    @ViewChild('file', {static: false}) fileInput;

    tabs: Array<TitleTab> = [];

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
        this.addSubscription(activatedRoute.data, this.onSkeleton.bind(this));
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    removeAnswer (answerId: string): void {
        this._threadSkeleton.poll.answers = this._threadSkeleton.poll.answers
            .filter(answer => answer.id !== answerId);
    }

    onTabClick (action: number): void {
        switch (action) {
            case ThreadControllerActions.BACK:
                if (this.isNew) {
                    this._router.navigateByUrl(`/forum/category/${this._threadSkeleton.categoryId}/page/1`);
                } else {
                    this._router.navigateByUrl(`/forum/thread/${this._threadSkeleton.threadId}/page/1`);
                }
                break;
            case ThreadControllerActions.SAVE:
                this.saveThread();
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
        return this._threadSkeleton.tags.indexOf(tag) > -1;
    }

    toggleTag ($event, tag: string): void {
        $event.preventDefault();
        if (this.haveTag(tag)) {
            this._threadSkeleton.tags = this._threadSkeleton.tags.filter(t => t !== tag);
        } else {
            this._threadSkeleton.tags.push(tag);
        }
    }

    onKeyUp (content: string): void {
        AutoSaveHelper.save({
            title: this.thread.title,
            content: content,
            type: AutoSave.THREAD,
            contentId: this._threadSkeleton.categoryId
        });
    }

    onPollToggle (): void {
        this._threadSkeleton.poll = !this._threadSkeleton.poll ? new ThreadPoll({isNew: true}) : null;
        if (this._threadSkeleton.poll) {
            this.addThreadAnswer();
            this.addThreadAnswer();
        }
    }

    addThreadAnswer (): void {
        this._threadSkeleton.poll.answers.push(new ThreadAnswer());
    }

    get thread (): ThreadSkeleton {
        return this._threadSkeleton;
    }

    get pageTitle (): string {
        return !this.isNew ?
            `Edit Thread: ${this._threadSkeleton.title}` :
            `Creating New Thread: ${this._threadSkeleton.title}`;
    }

    get badge (): string {
        return this._threadSkeleton.badge;
    }

    set badge (value: string) {
        this._threadSkeleton.badge = value;
    }

    get isNew (): boolean {
        return !Boolean(this._threadSkeleton && this._threadSkeleton.createdAt);
    }

    get shouldHaveThumbnail (): boolean {
        return CategoryTemplates.DEFAULT !== this._threadSkeleton.template;
    }

    get isQuestTemplate (): boolean {
        return CategoryTemplates.QUEST === this._threadSkeleton.template;
    }

    get badgeUrl (): string {
        return this._threadSkeleton.badge ? `https://habboo-a.akamaihd.net/c_images/album1584/${this._threadSkeleton.badge}.gif` : '';
    }

    get canHavePoll (): boolean {
        return this._threadSkeleton.canHavePoll;
    }

    get badeHaveError (): boolean {
        return Boolean(this._threadSkeleton.badge && this._threadSkeleton.badge.match(new RegExp(/[^A-Za-z0-9]+/)));
    }

    private onOpenAutoSave (): void {
        const autoSave = AutoSaveHelper.get(AutoSave.THREAD, this._threadSkeleton.categoryId);
        this.thread.title = autoSave.title;
        this.editor.content = autoSave.content;
        AutoSaveHelper.remove(AutoSave.THREAD, this._threadSkeleton.categoryId);
        this.tabs = this.tabs.filter(button => button.value !== ThreadControllerActions.AUTO_SAVE);
    }

    private onSkeleton (data: { data: ThreadSkeleton }): void {
        this._threadSkeleton = data.data;
        this.setPrefix();
        this.setBreadcrumb();

        this.tabs = [
            new TitleTab({title: 'Save', value: ThreadControllerActions.SAVE}),
            new TitleTab({title: 'Toggle Poll', value: ThreadControllerActions.TOGGLE_POLL}),
            new TitleTab({title: 'Back', value: ThreadControllerActions.BACK})
        ];

        if (this._threadSkeleton.poll || !this._threadSkeleton.canHavePoll) {
            this.tabs = this.tabs.filter(button => button.value !== ThreadControllerActions.TOGGLE_POLL);
        }

        if (AutoSaveHelper.exists(AutoSave.THREAD, this._threadSkeleton.categoryId)) {
            this.tabs.push(new TitleTab({
                title: 'Open Auto-Save',
                value: ThreadControllerActions.AUTO_SAVE
            }));
        }
    }

    private setBreadcrumb (): void {
        const threadCrumb = this.isNew ? [] : [new BreadcrumbItem({
            title: this._threadSkeleton.title,
            url: `/forum/thread/${this._threadSkeleton.threadId}/page/1`
        })];

        this._breadcrumbService.breadcrumb = new Breadcrumb({
            current: this._threadSkeleton.threadId > 0 ? 'Editing' : 'New',
            items: [FORUM_BREADCRUM_ITEM].concat(this._threadSkeleton.parents
                .sort(ArrayHelper.sortByPropertyDesc.bind(this, 'displayOrder'))
                .map(parent => new BreadcrumbItem({
                    title: parent.title,
                    url: `/forum/category/${parent.categoryId}/page/1`
                })).concat(threadCrumb))
        });
    }

    private setPrefix (): void {
        this._threadSkeleton.prefixId =
            this._threadSkeleton.prefixes.findIndex(prefix => prefix.prefixId === this._threadSkeleton.prefixId) > -1 ?
                this._threadSkeleton.prefixId : 0;
    }

    private saveThread (): void {
        this._threadSkeleton.content = this.editor.getEditorValue();
        const form = new FormData();
        if (this._threadSkeleton.template !== CategoryTemplates.DEFAULT && this.fileInput.nativeElement.files) {
            const file = this.fileInput.nativeElement.files[0];
            form.append('thumbnail', file);
        }
        form.append('thread', JSON.stringify(this._threadSkeleton));
        if (!this.isNew) {
            this._httpClient.post(`rest/api/forum/thread/update/${this._threadSkeleton.threadId}`, form)
                .subscribe(res => {
                    this.onSuccessUpdate(res);
                }, error => {
                    this._notificationService.failureNotification(error);
                });
        } else {
            this._httpClient.post('rest/api/forum/thread', form)
                .subscribe((res: { threadId: number }) => {
                    this.onSuccessCreate(res);
                }, error => {
                    this._notificationService.failureNotification(error);
                });
        }
    }

    private onSuccessUpdate (res): void {
        this._threadSkeleton = new ThreadSkeleton(res);
        AutoSaveHelper.remove(AutoSave.THREAD, this._threadSkeleton.categoryId);
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success!',
            message: 'Thread is updated!'
        }));
    }

    private onSuccessCreate (data: { threadId: number }): void {
        AutoSaveHelper.remove(AutoSave.THREAD, this._threadSkeleton.categoryId);
        if (this._threadSkeleton.contentApproval) {
            this._dialogService.openDialog({
                title: 'You thread is currently awaiting approval!',
                content: `Your thread is placed under the category of "unapproved" threads,
                    and it await approval from the Moderators before being visible!`,
                buttons: [
                    new DialogButton({
                        title: 'Ok', callback: () => {
                            this._dialogService.closeDialog();
                            this._router.navigateByUrl(`/forum/category/${this._threadSkeleton.categoryId}/page/1`);
                        }
                    })
                ]
            });
        } else {
            this._router.navigateByUrl(`/forum/thread/${data.threadId}/page/1`);
        }
    }
}
