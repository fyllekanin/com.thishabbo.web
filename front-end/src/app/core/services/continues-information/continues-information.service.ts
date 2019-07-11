import { Observable, Subject } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { Injectable, NgZone } from '@angular/core';
import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { UserService } from 'core/services/user/user.service';
import { AuthService } from 'core/services/auth/auth.service';
import { ContinuesInformationModel, PING_TYPES } from 'core/services/continues-information/continues-information.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ArrayHelper } from 'shared/helpers/array.helper';

@Injectable()
export class ContinuesInformationService implements Resolve<void> {
    private _onContinuesInformationSubject: Subject<ContinuesInformationModel> = new Subject();
    private _onDeviceSettingsUpdated: Subject<void> = new Subject();

    private _notificationsSubject: Subject<Array<NotificationModel<any>>> = new Subject();
    private _notifications: Array<NotificationModel<any>> = [];
    private _readNotifications: Array<number> = [];

    private _timer;
    private _fastInterval = 1000 * 5;
    private _slowInterval = (1000 * 60) * 5;
    private _currentInterval = this._fastInterval;

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
        this._readNotifications.push(notificationId);
        this._notifications = this._notifications.filter(item => item.notificationId !== notificationId);
    }

    removeNotificationIds (ids: Array<number>): void {
        this._readNotifications = this._readNotifications.concat(ids);
        this._notifications = this._notifications.filter(notification => ids.indexOf(notification.notificationId) === -1);
    }

    deviceSettingsUpdated (): void {
        this._onDeviceSettingsUpdated.next();
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
            this.doRequest();
            this._timer = setInterval(() => {
                this.doRequest();
            }, this._currentInterval);
        });
    }

    private fetchNotifications (): void {
        if (!this._authService.isLoggedIn()) {
            return;
        }
        this._httpService.get(`puller/notifications/unread`)
            .subscribe(this.onNotificationData.bind(this));
    }

    private onContinuesInformationData (response): void {
        this._ngZone.run(() => {
            const data = new ContinuesInformationModel(response);
            this.setUserPoints(data);
            this._onContinuesInformationSubject.next(data);

            if (this._notifications.length < data.unreadNotifications) {
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
        this._notifications = res.map(item => new NotificationModel(item));

        const notificationIds = [];
        this._notifications = this._notifications
            .filter(notification => this._readNotifications.indexOf(notification.notificationId) === -1)
            .filter(notification => {
                if (notificationIds.indexOf(notification.notificationId) === -1) {
                    notificationIds.push(notification.notificationId);
                    return true;
                }
                return false;
            });
        this._notifications.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'notificationId'));

        this._notificationsSubject.next(this._notifications);
    }

    private isFastInterval () {
        return this._currentInterval === this._fastInterval;
    }
}
