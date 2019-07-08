import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NotificationView } from 'shared/components/notification-views/notification-views.model';
import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { SlimUser } from 'core/services/auth/auth.model';
import { Router } from '@angular/router';
import { LikeDjView } from 'shared/components/notification-views/like-dj-view/like-dj-view.model';

@Component({
    selector: 'app-top-bar-like-dj-view',
    templateUrl: 'like-dj-view.component.html',
    styleUrls: ['../notification.views.css']
})
export class LikeDjViewComponent implements NotificationView {
    private _notification: NotificationModel<LikeDjView>;

    @Output()
    onClick = new EventEmitter<number>();

    constructor (private _router: Router) {
    }

    @Input()
    set notification (notification: NotificationModel<LikeDjView>) {
        this._notification = notification;
    }

    getTime (): string {
        return this._notification.createdAt;
    }

    get imagePath (): string {
        return `/rest/resources/images/users/${this.user.userId}.gif?${this.user.avatarUpdatedAt}`;
    }

    get user (): SlimUser {
        return this._notification.item.user;
    }

    @HostListener('click', ['$event.target'])
    click (event): void {
        this.onClick.next(this._notification.notificationId);
        if (event && event.className.indexOf('readOnly') === -1) {
            this._router.navigateByUrl(`/user/profile/${this.user.nickname}`);
        }
    }
}
