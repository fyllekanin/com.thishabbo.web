import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'core/services/auth/auth.service';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AvatarService implements Resolve<{ height: number; width: number }> {

    constructor(
        private _httpService: HttpService,
        private _httpClient: HttpClient,
        private _authService: AuthService,
        private _notificationService: NotificationService
    ) {
    }

    resolve(): Observable<{ height: number; width: number }> {
        return this._httpService.get('usercp/avatar');
    }

    save(data: FormData): Observable<void> {
        return this._httpClient.post('rest/api/usercp/avatar', data)
            .pipe(map(res => {
                this._authService.authUser.avatarUpdatedAt = <number>res;
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'Avatar Updated'
                }));
            }));
    }
}
