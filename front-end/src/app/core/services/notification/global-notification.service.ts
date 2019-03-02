import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class GlobalNotificationService {
    private _onGlobalNotificationSubject: Subject<GlobalNotification> = new Subject();

    failureNotification(error: HttpErrorResponse): void {
        this.sendGlobalNotification(new GlobalNotification({
            title: 'Error',
            message: error.error.message,
            type: NotificationType.ERROR
        }));
    }

    sendGlobalNotification(notification: GlobalNotification): void {
        if (!notification) {
            return;
        }
        this._onGlobalNotificationSubject.next(notification);
    }

    get onGlobalNotification(): Observable<GlobalNotification> {
        return this._onGlobalNotificationSubject.asObservable();
    }
}
