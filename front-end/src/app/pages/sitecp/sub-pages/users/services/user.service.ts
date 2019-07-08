import { BasicModel, BasicPage } from '../basic/basic.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class UserService implements Resolve<BasicModel> {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<BasicModel> {
        const userId = route.params['userId'];
        return this._httpService.get(`sitecp/users/${userId}/basic`)
            .pipe(map(res => new BasicModel(res)));
    }

    save (basicUser: BasicPage): void {
        this._httpService.put(`sitecp/users/${basicUser.user.userId}/basic`, {
            user: basicUser.user,
            role: basicUser.customFields.role
        })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'User saved!'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
