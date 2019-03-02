import { BasicModel } from '../basic/basic.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class UserService implements Resolve<BasicModel> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<BasicModel> {
        const userId = route.params['userId'];
        return this._httpService.get(`admin/users/${userId}/basic`)
            .pipe(map(res => new BasicModel(res)));
    }

    save(user: BasicModel): void {
        this._httpService.put(`admin/users/${user.userId}/basic`, { user: user })
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'User saved!'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }
}
