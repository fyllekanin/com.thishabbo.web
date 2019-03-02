import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationSettingsModel } from '../notification-settings/notification-settings.model';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';

@Injectable()
export class UsercpNotificationSettingsService implements Resolve<NotificationSettingsModel> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {
    }

    resolve(): Observable<NotificationSettingsModel> {
        return this._httpService.get('usercp/notification-settings')
            .pipe(map(res => new NotificationSettingsModel(res)));
    }

    save(data: NotificationSettingsModel): void {
        this._httpService.put('usercp/notification-settings', { ignoredNotificationTypes: data })
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Notification settings updated'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }
}
