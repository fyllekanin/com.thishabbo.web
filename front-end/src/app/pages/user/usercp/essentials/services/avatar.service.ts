import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'core/services/auth/auth.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { map } from 'rxjs/operators';
import { AvatarModel } from '../avatar/avatar.model';

@Injectable()
export class AvatarService implements Resolve<AvatarModel> {

    constructor (
        private _httpService: HttpService,
        private _httpClient: HttpClient,
        private _authService: AuthService,
        private _notificationService: NotificationService
    ) {
    }

    resolve (): Observable<AvatarModel> {
        return this._httpService.get('usercp/avatar')
            .pipe(map(res => new AvatarModel(res)));
    }

    save (data: FormData): Observable<AvatarModel> {
        return this._httpClient.post('api/usercp/avatar', data)
            .pipe(map(res => {
                this._authService.authUser.avatarUpdatedAt = new Date().getTime() / 1000;
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Avatar Updated'
                }));
                return new AvatarModel(res);
            }));
    }

    switchBack (id: number): Observable<AvatarModel> {
        return this._httpClient.put(`api/usercp/avatar/${id}`, null)
            .pipe(map(res => {
                this._authService.authUser.avatarUpdatedAt = new Date().getTime() / 1000;
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Avatar Updated'
                }));
                return new AvatarModel(res);
            }));
    }
}
