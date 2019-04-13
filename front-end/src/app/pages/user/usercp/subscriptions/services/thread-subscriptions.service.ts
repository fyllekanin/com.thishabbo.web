import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ThreadSubscription } from '../thread-subscriptions/thread-subscriptions.model';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class ThreadSubscriptionsService implements Resolve<Array<ThreadSubscription>> {

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {}

    unsubscribe(threadId: number): Observable<void> {
        return this._httpService.delete(`forum/thread/unsubscribe/${threadId}`)
            .pipe(catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    resolve(): Observable<Array<ThreadSubscription>> {
        return this._httpService.get('usercp/thread-subscriptions')
            .pipe(map(res => {
                return res.map(item => new ThreadSubscription(item));
            }));
    }
}
