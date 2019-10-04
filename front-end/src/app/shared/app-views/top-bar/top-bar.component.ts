import { AuthService } from 'core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Component } from '@angular/core';
import { NotificationModel, NotificationTypes } from 'shared/app-views/top-bar/top-bar.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { RouterStateService } from 'core/services/router/router-state.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-top-bar',
    templateUrl: 'top-bar.component.html',
    styleUrls: [ 'top-bar.component.css' ]
})
export class TopBarComponent {
    loginName = '';
    password = '';
    notifications: Array<NotificationModel<any>> = [];
    messages: Array<NotificationModel<any>> = [];

    constructor (
        private _authService: AuthService,
        private _router: Router,
        private _httpService: HttpService,
        private _routerStateService: RouterStateService,
        private _continuesInformationService: ContinuesInformationService,
        private _notificationService: NotificationService
    ) {
        this._continuesInformationService.onNotifications.subscribe(this.onNotifications.bind(this));
    }

    login (): void {
        this._authService.login(this.loginName, this.password, true, () => {
            this._router.navigateByUrl('/auth/login');
        });
        this.loginName = '';
        this.password = '';
    }

    notificationClick (notificationId: number): void {
        this._httpService.put(`puller/notifications/read/${notificationId}`)
            .subscribe(() => {
                this._continuesInformationService.removeNotification(notificationId);
                this.notifications = this.notifications.filter(this.isNotification)
                    .filter(notification => notification.notificationId !== notificationId);
                this.messages = this.messages.filter(this.isMessage)
                    .filter(notification => notification.notificationId !== notificationId);
                this._routerStateService.updateNotificationAmount(this.notifications.length);
            });
    }

    readAllNotifications (): void {
        this._httpService.put('puller/notifications/read/all/notifications')
            .subscribe(() => {
                this._continuesInformationService.removeNotificationIds(this.notifications
                    .map(notification => notification.notificationId));
                this.notifications = [];
                this.updateTitle();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'All notifications marked as read!'
                }));
            });
    }

    readAllMessages (): void {
        this._httpService.put('puller/notifications/read/all/messages')
            .subscribe(() => {
                this._continuesInformationService.removeNotificationIds(this.messages
                    .map(notification => notification.notificationId));
                this.messages = [];
                this.updateTitle();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'All messages marked as read!'
                }));
            });
    }

    get loggedIn (): boolean {
        return this._authService.isLoggedIn();
    }

    private onNotifications (notifications: Array<NotificationModel<any>>): void {
        this.notifications = notifications.filter(this.isNotification);
        this.messages = notifications.filter(this.isMessage);
        this.updateTitle();
    }

    private updateTitle (): void {
        this._routerStateService.updateNotificationAmount(this.notifications.length + this.messages.length);
    }

    private isMessage (notification: NotificationModel<any>): boolean {
        return notification.type === NotificationTypes.VISITOR_MESSAGE;
    }

    private isNotification (notification: NotificationModel<any>): boolean {
        return [
            NotificationTypes.FOLLOWED,
            NotificationTypes.BADGE,
            NotificationTypes.CATEGORY_SUBSCRIPTION,
            NotificationTypes.INFRACTION_DELETED,
            NotificationTypes.INFRACTION_GIVE,
            NotificationTypes.MENTION,
            NotificationTypes.QUOTE,
            NotificationTypes.THREAD_SUBSCRIPTION,
            NotificationTypes.LIKE_POST,
            NotificationTypes.RADIO_REQUEST,
            NotificationTypes.LIKE_DJ,
            NotificationTypes.LIKE_HOST,
            NotificationTypes.SENT_THC,
            NotificationTypes.REFERRAL
        ].indexOf(notification.type) > -1;
    }
}
