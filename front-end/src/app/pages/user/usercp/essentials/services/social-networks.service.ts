import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SocialNetworksModel } from '../social-networks/social-networks.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class SocialNetworksService implements Resolve<SocialNetworksModel> {

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve(): Observable<SocialNetworksModel> {
        return this._httpService.get('usercp/social-networks')
            .pipe(map((res => new SocialNetworksModel(res))));
    }

    save(data: SocialNetworksModel): Subscription {
        return this._httpService.put('usercp/social-networks', data)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'Social networks updates'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
