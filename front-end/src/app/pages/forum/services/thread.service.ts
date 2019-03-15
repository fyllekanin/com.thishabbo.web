import { ThreadPage } from '../thread/thread.model';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class ThreadService implements Resolve<ThreadPage> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ThreadPage> {
        const threadId = route.params['id'];
        const page = route.params['page'];
        return this._httpService.get(`page/thread/${threadId}/page/${page}`)
            .pipe(map(res => new ThreadPage(res)));
    }

    toggleSubscription(thread: ThreadPage): Observable<boolean> {
        const call = thread.isSubscribed ?
            this._httpService.delete(`forum/thread/unsubscribe/${thread.threadId}`) :
            this._httpService.post(`forum/thread/subscribe/${thread.threadId}`, null);

        return call.pipe(map(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: `You ${thread.isSubscribed ? 'unsubscribed' : 'subscribed'} to the thread`
                }));
                return !thread.isSubscribed;
            }), catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }

    toggleIgnore(thread: ThreadPage): Observable<boolean> {
        const call = thread.isIgnored ?
            this._httpService.delete(`forum/thread/${thread.threadId}/ignore`) :
            this._httpService.post(`forum/thread/${thread.threadId}/ignore`, null);

        return call.pipe(map(() => {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Success',
                message: `You ${thread.isIgnored ? 'unignored' : 'ignored'} the thread`
            }));
            return !thread.isIgnored;
        }), catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }
}
