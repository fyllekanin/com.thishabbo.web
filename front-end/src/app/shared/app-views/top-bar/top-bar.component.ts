import { AuthService } from 'core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Component } from '@angular/core';
import { NotificationModel, NotificationTypes } from 'shared/app-views/top-bar/top-bar.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { RouterStateService } from 'core/services/router/router-state.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { ThemeHelper } from 'shared/helpers/theme.helper';
import { StringHelper } from 'shared/helpers/string.helper';

@Component({
    selector: 'app-top-bar',
    templateUrl: 'top-bar.component.html',
    styleUrls: ['top-bar.component.css']
})

export class TopBarComponent {
    private _notifications: Array<NotificationModel<any>> = [];
    private _messages: Array<NotificationModel<any>> = [];

    loginName = '';
    password = '';

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

    keyDownFunction (event): void {
        if (StringHelper.isKey(event, 'enter')) {
            this.login();
        }
    }

    notificationClick (notificationId: number): void {
        this._httpService.put(`puller/notifications/read/${notificationId}`)
            .subscribe(() => {
                this._continuesInformationService.removeNotification(notificationId);
                this._notifications = this._notifications.filter(this.isNotification)
                    .filter(notification => notification.notificationId !== notificationId);
                this._messages = this._messages.filter(this.isMessage)
                    .filter(notification => notification.notificationId !== notificationId);
                this._routerStateService.updateNotificationAmount(this._notifications.length);
            });
    }

    readAllNotifications (): void {
        this._httpService.put('puller/notifications/read/all/notifications')
            .subscribe(() => {
                this._continuesInformationService.removeNotificationIds(this._notifications
                    .map(notification => notification.notificationId));
                this._notifications = [];
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
                this._continuesInformationService.removeNotificationIds(this._messages
                    .map(notification => notification.notificationId));
                this._messages = [];
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

    get notifications (): Array<NotificationModel<any>> {
        return this._notifications;
    }

    get messages (): Array<NotificationModel<any>> {
        return this._messages;
    }

    get isMobile (): boolean {
        return ThemeHelper.isMobile();
    }

    private onNotifications (notifications: Array<NotificationModel<any>>): void {
        this._notifications = notifications.filter(this.isNotification);
        this._messages = notifications.filter(this.isMessage);
        this.updateTitle();
    }

    private updateTitle (): void {
        this._routerStateService.updateNotificationAmount(this._notifications.length + this._messages.length);
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
            NotificationTypes.SENT_THC
        ].indexOf(notification.type) > -1;
    }
}
