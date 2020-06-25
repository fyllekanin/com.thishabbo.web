import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import {
    NotificationView,
    shouldPerformClickOnNotification
} from 'shared/components/notification-views/notification-views.model';
import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { SlimUser } from 'core/services/auth/auth.model';
import { Router } from '@angular/router';
import { VisitorMessageView } from 'shared/components/notification-views/visitor-message-view/visitor-message-view.model';
import { AuthService } from 'core/services/auth/auth.service';

@Component({
    selector: 'app-top-bar-visitor-message-view',
    templateUrl: 'visitor-message-view.component.html',
    styleUrls: [ '../notification.views.css' ]
})
export class VisitorMessageViewComponent implements NotificationView {
    private _notification: NotificationModel<VisitorMessageView>;

    @Output()
    onClick = new EventEmitter<number>();

    constructor (
        private _router: Router,
        private _authService: AuthService
    ) {
    }

    @Input()
    set notification (notification: NotificationModel<VisitorMessageView>) {
        this._notification = notification;
    }

    getTime (): string {
        return this._notification.createdAt;
    }

    get isMyProfile (): boolean {
        return this._notification.item.host &&
            this._notification.item.host.userId === this._authService.authUser.userId;
    }

    get host (): SlimUser {
        return this._notification.item.host;
    }

    get imagePath (): string {
        return `/resources/images/users/${this.user.userId}.gif?${this.user.avatarUpdatedAt}`;
    }

    get user (): SlimUser {
        return this._notification.item.user;
    }

    @HostListener('click', [ '$event.target' ])
    click (event): void {
        this.onClick.next(this._notification.notificationId);

        if (shouldPerformClickOnNotification(event)) {
            this._router.navigateByUrl(`/user/profile/${this.host.nickname}/page/${this._notification.item.page}?` +
                `visitorMessageId=${this._notification.item.subjectId}&scrollTo=vmId-${this._notification.item.subjectId}`);
        }
    }
}
