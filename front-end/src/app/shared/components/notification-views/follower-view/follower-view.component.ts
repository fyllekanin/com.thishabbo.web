import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NotificationView } from 'shared/components/notification-views/notification-views.model';
import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { FollowerView } from 'app/shared/components/notification-views/follower-view/follower-view.model';
import { SlimUser } from 'core/services/auth/auth.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-top-bar-follower-view',
    templateUrl: 'follower-view.component.html',
    styleUrls: ['../notification.views.css']
})
export class FollowerViewComponent implements NotificationView {
    private _notification: NotificationModel<FollowerView>;

    @Output()
    onClick = new EventEmitter<number>();
    isAvatarFailing = false;

    constructor (private _router: Router) {
    }

    @Input()
    set notification (notification: NotificationModel<FollowerView>) {
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

    get isApproved (): boolean {
        return this._notification.item.isApproved;
    }

    @HostListener('click', ['$event.target'])
    click (event): void {
        this.onClick.next(this._notification.notificationId);
        if (event && event.className.indexOf('readOnly') === -1) {
            this._router.navigateByUrl(`/user/profile/${this.user.nickname}`);
        }
    }
}
