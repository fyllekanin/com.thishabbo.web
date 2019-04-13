import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PostBitModel } from '../post-bit/post-bit.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class PostBitService implements Resolve<PostBitModel> {

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve(): Observable<PostBitModel> {
        return this._httpService.get('usercp/post-bit')
            .pipe(map((res => new PostBitModel(res))));
    }

    save(data: PostBitModel): void {
        this._httpService.put('usercp/post-bit', { postBitOptions: data })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'PostBit Settings Updated'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
