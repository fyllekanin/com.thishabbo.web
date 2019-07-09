import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NotificationView } from 'shared/components/notification-views/notification-views.model';
import { ThreadView } from 'app/shared/components/notification-views/thread-view/thread-view.model';
import { NotificationModel, NotificationTypes } from 'shared/app-views/top-bar/top-bar.model';
import { SlimUser } from 'core/services/auth/auth.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-top-bar-thread-view',
    templateUrl: 'thread-view.component.html',
    styleUrls: ['../notification.views.css']
})
export class ThreadViewComponent implements NotificationView {
    private _notification: NotificationModel<ThreadView>;

    @Output()
    onClick = new EventEmitter<number>();

    constructor (private _router: Router) {
    }

    @Input()
    set notification (notification: NotificationModel<ThreadView>) {
        this._notification = notification;
    }

    get imagePath (): string {
        return `/rest/resources/images/users/${this.user.userId}.gif?${this.user.avatarUpdatedAt}`;
    }

    get user (): SlimUser {
        return this._notification.item.user;
    }

    get title (): string {
        return this._notification.item.thread.title;
    }

    get text (): string {
        switch (this._notification.type) {
            case NotificationTypes.MENTION:
                return `mentioned you in a post in the thread`;
            case NotificationTypes.QUOTE:
                return `quoted your post in the thread`;
            case NotificationTypes.THREAD_SUBSCRIPTION:
                return `posted in a thread you are subscribed to`;
            case NotificationTypes.LIKE_POST:
                return `liked your post in the thread`;
        }
        return '';
    }

    getTime (): string {
        return this._notification.createdAt;
    }

    @HostListener('click', ['$event.target'])
    click (event): void {
        this.onClick.next(this._notification.notificationId);

        if (event && event.className.indexOf('readOnly') === -1) {
            const thread = this._notification.item.thread;
            const postId = this._notification.item.thread.postId;
            this._router.navigateByUrl(`/forum/thread/${thread.threadId}/page/${thread.page}?scrollTo=post-${postId}`);
        }
    }
}
