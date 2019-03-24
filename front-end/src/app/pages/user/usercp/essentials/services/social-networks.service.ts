import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SocialNetworksModel } from '../social-networks/social-networks.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class SocialNetworksService implements Resolve<SocialNetworksModel> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {
    }

    resolve(): Observable<SocialNetworksModel> {
        return this._httpService.get('usercp/social-networks')
            .pipe(map((res => new SocialNetworksModel(res))));
    }

    save(data: SocialNetworksModel): Subscription {
        return this._httpService.put('usercp/social-networks', data)
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Social networks updates'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }
}
