import { Observable, Subject } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { Injectable, NgZone } from '@angular/core';
import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { UserService } from 'core/services/user/user.service';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { AuthService } from 'core/services/auth/auth.service';
import { ContinuesInformationModel, PING_TYPES } from 'core/services/continues-information/continues-information.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable()
export class ContinuesInformationService implements Resolve<void> {
    private _onContinuesInformationSubject: Subject<ContinuesInformationModel> = new Subject();
    private _onDeviceSettingsUpdated: Subject<void> = new Subject();

    private _lastNotificationCheck = 0;
    private _notificationsSubject: Subject<Array<NotificationModel<any>>> = new Subject();
    private _notifications: Array<NotificationModel<any>> = [];

    private _timer;
    private _fastInterval = 1000 * 5;
    private _slowInterval = (1000 * 60) * 5;
    private _currentInterval = this._fastInterval;

    private _onTabsUpdatedSubject: Subject<void> = new Subject();

    constructor (
        private _httpService: HttpService,
        private _ngZone: NgZone,
        private _authService: AuthService,
        userService: UserService
    ) {
        this.updateInterval();
        userService.onUserActivityChange.subscribe(isUserActive => {
            this.onUserActivityChange(isUserActive);
        });
        this._authService.onUserChange.subscribe(() => {
            if (!this._authService.isLoggedIn()) {
                this._notifications = [];
                this._notificationsSubject.next(this._notifications);
                this._lastNotificationCheck = 0;
            }
        });
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<void> {
        let prefix = '';
        if (activatedRouteSnapshot.data['type']) {
            prefix = activatedRouteSnapshot.data['type'] === PING_TYPES.SITECP ? 'sitecp/' : 'staff/';
        }
        return this._httpService.get(prefix + 'ping');
    }

    removeNotification (notificationId: number): void {
        this._notifications = this._notifications.filter(item => item.notificationId !== notificationId);
    }

    removeNotificationIds (ids: Array<number>): void {
        this._notifications = this._notifications.filter(notification => ids.indexOf(notification.notificationId) === -1);
    }

    tabsUpdated (): void {
        this._onTabsUpdatedSubject.next();
    }

    deviceSettingsUpdated (): void {
        this._onDeviceSettingsUpdated.next();
    }

    get onTabsUpdated (): Observable<void> {
        return this._onTabsUpdatedSubject.asObservable();
    }

    get onNotifications (): Observable<Array<NotificationModel<any>>> {
        return this._notificationsSubject.asObservable();
    }

    get onContinuesInformation (): Observable<ContinuesInformationModel> {
        return this._onContinuesInformationSubject.asObservable();
    }

    get onDeviceSettingsUpdated (): Observable<void> {
        return this._onDeviceSettingsUpdated.asObservable();
    }

    private onUserActivityChange (isUserActive): void {
        if (this.isFastInterval() && isUserActive) {
            return;
        }

        if (!this.isFastInterval() && isUserActive) {
            this._currentInterval = this._fastInterval;
        } else if (this.isFastInterval() && !isUserActive) {
            this._currentInterval = this._slowInterval;
        }
        this.updateInterval();
    }

    private doRequest (): void {
        this._httpService.get('puller/pull')
            .subscribe(this.onContinuesInformationData.bind(this));
    }

    private updateInterval (): void {
        this._ngZone.runOutsideAngular(() => {
            clearInterval(this._timer);
            this._timer = setInterval(() => {
                this.doRequest();
            }, this._currentInterval);
        });
    }

    private fetchNotifications (): void {
        if (!this._authService.isLoggedIn()) {
            return;
        }
        this._httpService.get(`puller/notifications/unread/${this._lastNotificationCheck}`)
            .subscribe(this.onNotificationData.bind(this));
    }

    private onContinuesInformationData (response): void {
        this._ngZone.run(() => {
            const data = new ContinuesInformationModel(response);
            this.setUserPoints(data);
            this._onContinuesInformationSubject.next(data);

            if (this._notifications.length < data.unreadNotifications) {
                this._lastNotificationCheck = 0;
                this._notifications = [];
                this.fetchNotifications();
            }
        });
    }

    private setUserPoints (data: ContinuesInformationModel): void {
        if (!this._authService.isLoggedIn() || !data.user) {
            return;
        }
        this._authService.authUser.credits = data.user.credits;
        this._authService.authUser.xp = data.user.xp;
    }

    private onNotificationData (res: Array<any>): void {
        const newNotifications = res.map(item => new NotificationModel(item));
        const newNotificationIds = newNotifications.map(noti => noti.notificationId);

        this._notifications = this._notifications.filter(noti => newNotificationIds.indexOf(noti.notificationId) > -1);
        this._notifications = this._notifications.concat(newNotifications);
        this._notifications.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'notificationId'));

        this._notificationsSubject.next(this._notifications);
        this._lastNotificationCheck = Math.floor(new Date().getTime() / 1000);
    }

    private isFastInterval () {
        return this._currentInterval === this._fastInterval;
    }
}
