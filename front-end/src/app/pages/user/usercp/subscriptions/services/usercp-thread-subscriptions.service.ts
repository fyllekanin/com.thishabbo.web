import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ThreadSubscription } from '../thread-subscriptions/thread-subscriptions.model';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { catchError, map } from 'rxjs/operators';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';

@Injectable()
export class UsercpThreadSubscriptionsService implements Resolve<Array<ThreadSubscription>> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {}

    unsubscribe(threadId: number): Observable<void> {
        return this._httpService.delete(`forum/thread/unsubscribe/${threadId}`)
            .pipe(catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }

    resolve(): Observable<Array<ThreadSubscription>> {
        return this._httpService.get('usercp/thread-subscriptions')
            .pipe(map(res => {
                return res.map(item => new ThreadSubscription(item));
            }));
    }
}
