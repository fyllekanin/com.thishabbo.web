import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationSettingsModel } from '../notification-settings/notification-settings.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class NotificationSettingsService implements Resolve<NotificationSettingsModel> {

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve(): Observable<NotificationSettingsModel> {
        return this._httpService.get('usercp/notification-settings')
            .pipe(map(res => new NotificationSettingsModel(res)));
    }

    save(data: NotificationSettingsModel): void {
        this._httpService.put('usercp/notification-settings', { ignoredNotificationTypes: data })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Notification settings updated'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
