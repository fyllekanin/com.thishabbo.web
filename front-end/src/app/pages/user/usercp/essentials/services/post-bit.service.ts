import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PostBitModel } from '../post-bit/post-bit.model';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';

@Injectable()
export class PostBitService implements Resolve<PostBitModel> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {
    }

    resolve(): Observable<PostBitModel> {
        return this._httpService.get('usercp/post-bit')
            .pipe(map((res => new PostBitModel(res))));
    }

    save(data: PostBitModel): void {
        this._httpService.put('usercp/post-bit', { postBitOptions: data })
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'PostBit Settings Updated'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }
}
