import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NotificationView } from 'shared/components/notification-views/notification-views.model';
import { NotificationModel, NotificationTypes } from 'shared/app-views/top-bar/top-bar.model';
import { SlimUser } from 'core/services/auth/auth.model';
import { Router } from '@angular/router';
import { UserView } from 'shared/components/notification-views/user-view/user-view.model';

@Component({
    selector: 'app-top-bar-user-view',
    templateUrl: 'user-view.component.html',
    styleUrls: ['../notification.views.css']
})
export class UserViewComponent implements NotificationView {
    private _notification: NotificationModel<UserView>;

    @Output()
    onClick = new EventEmitter<number>();

    constructor (private _router: Router) {
    }

    @Input()
    set notification (notification: NotificationModel<UserView>) {
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

    get isDjLike (): boolean {
        return this._notification.type === NotificationTypes.LIKE_DJ;
    }

    get isRadioRequest (): boolean {
        return this._notification.type === NotificationTypes.RADIO_REQUEST;
    }

    @HostListener('click', ['$event.target'])
    click (event): void {
        this.onClick.next(this._notification.notificationId);
        if (event && event.className.indexOf('readOnly') === -1) {
            switch (this._notification.type) {
                case NotificationTypes.LIKE_DJ:
                    this._router.navigateByUrl(`/user/profile/${this.user.nickname}`);
                    break;
                case NotificationTypes.RADIO_REQUEST:
                    this._router.navigateByUrl('/staff/radio/requests');
                    break;
            }
        }
    }
}
