import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationModel, NotificationType } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class NotificationService {
    private _onNotificationSubject: Subject<NotificationModel> = new Subject();

    failureNotification(error: HttpErrorResponse): void {
        this.sendNotification(new NotificationModel({
            title: 'Error',
            message: error.error.message,
            type: NotificationType.ERROR
        }));
    }

    sendNotification(notification: NotificationModel): void {
        if (!notification) {
            return;
        }
        this._onNotificationSubject.next(notification);
    }

    sendInfoNotification(message: string): void {
        this._onNotificationSubject.next(new NotificationModel({
            title: 'Success',
            message: message,
            type: NotificationType.INFO
        }));
    }

    sendErrorNotification(message: string): void {
        this._onNotificationSubject.next(new NotificationModel({
            title: 'Error',
            message: message,
            type: NotificationType.ERROR
        }));
    }

    get onNotification(): Observable<NotificationModel> {
        return this._onNotificationSubject.asObservable();
    }
}
