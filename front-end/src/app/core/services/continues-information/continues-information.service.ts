import { interval, Observable, Subject } from 'rxjs';
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
    private _event: EventSource;
    private _onContinuesInformationSubject: Subject<ContinuesInformationModel> = new Subject();
    private _lastStreamError = 0;

    private _lastNotificationCheck = 0;
    private _notificationsSubject: Subject<Array<NotificationModel<any>>> = new Subject();
    private _notifications: Array<NotificationModel<any>> = [];

    private _intervalSubscription;
    private _intervalSpeed = (1000 * 60) * 5;

    private _onTabsUpdatedSubject: Subject<void> = new Subject();

    constructor (
        private _httpService: HttpService,
        private _ngZone: NgZone,
        private _authService: AuthService,
        userService: UserService
    ) {
        userService.onUserActivityChange.subscribe(isUserActive => {
            this.updateIntervalTime(isUserActive);
            this.onUserActivityChange(isUserActive);
        });
        this._authService.onUserChange.subscribe(() => {
            if (this._authService.isLoggedIn()) {
                this.stopEventStream();
                this.startEventStream();
            } else {
                console.log(1);
                this._notifications = [];
                this._notificationsSubject.next(this._notifications);
                this._lastNotificationCheck = 0;
            }
        });
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<void> {
        let prefix = '';
        if (activatedRouteSnapshot.data['type']) {
            prefix = activatedRouteSnapshot.data['type'] === PING_TYPES.ADMIN ? 'admin/' : 'staff/';
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

    get onTabsUpdated (): Observable<void> {
        return this._onTabsUpdatedSubject.asObservable();
    }

    get onNotifications (): Observable<Array<NotificationModel<any>>> {
        return this._notificationsSubject.asObservable();
    }

    get onContinuesInformation (): Observable<ContinuesInformationModel> {
        return this._onContinuesInformationSubject.asObservable();
    }

    private onUserActivityChange (isUserActive): void {
        if (this._event && isUserActive) {
            return;
        }

        if (!this._event && isUserActive) {
            this.startEventStream();
        } else if (this._event && !isUserActive) {
            this.stopEventStream();
        }
    }

    private stopEventStream (): void {
        this._event.close();
        this._event = null;
    }

    private startEventStream (): void {
        if (this._event) {
            return;
        }
        const query = this._authService.isLoggedIn() ? `?userId=${this._authService.authUser.userId}` : '';
        this._event = new EventSource(`/rest/api/puller/stream${query}`);
        this._event.onmessage = this.onContinuesInformationData.bind(this);
        this._event.onerror = () => {
            const current = new Date().getTime();
            this.stopEventStream();
            if (this._lastStreamError < (current - 5000)) {
                this.startEventStream();
            }
            this._lastStreamError = current;
        };
    }

    private updateIntervalTime (isUserActive: boolean): void {
        if (isUserActive && this._intervalSubscription) {
            this._intervalSubscription.unsubscribe();
            this._intervalSubscription = null;
            return;
        } else if (!isUserActive && !this._intervalSubscription) {
            this.startInterval();
        }
    }

    private startInterval (): void {
        this._intervalSubscription = interval(this._intervalSpeed).subscribe(this.fetchNotifications.bind(this));
    }

    private fetchNotifications (): void {
        this._ngZone.run(() => {
            if (!this._authService.isLoggedIn()) {
                return;
            }
            this._httpService.get(`puller/notifications/unread/${this._lastNotificationCheck}`)
                .subscribe(this.onNotificationData.bind(this));
        });
    }

    private onContinuesInformationData (event: { data: string }): void {
        const data = new ContinuesInformationModel(JSON.parse(event.data));
        this._onContinuesInformationSubject.next(data);

        if (this._notifications.length < data.unreadNotifications) {
            this._lastNotificationCheck = 0;
            this._notifications = [];
            this.fetchNotifications();
        }
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
}
