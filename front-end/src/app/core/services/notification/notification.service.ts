import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class NotificationService {
    private _onNotificationSubject: Subject<NotificationMessage> = new Subject();

    failureNotification (error: HttpErrorResponse): void {
        this.sendNotification(new NotificationMessage({
            title: 'Error',
            message: error.error.message,
            type: NotificationType.ERROR
        }));
    }

    sendNotification (notification: NotificationMessage): void {
        if (!notification) {
            return;
        }
        this._onNotificationSubject.next(notification);
    }

    sendInfoNotification (message: string): void {
        this._onNotificationSubject.next(new NotificationMessage({
            title: 'Success',
            message: message,
            type: NotificationType.INFO
        }));
    }

    sendErrorNotification (message: string): void {
        this._onNotificationSubject.next(new NotificationMessage({
            title: 'Error',
            message: message,
            type: NotificationType.ERROR
        }));
    }

    get onNotification (): Observable<NotificationMessage> {
        return this._onNotificationSubject.asObservable();
    }
}
