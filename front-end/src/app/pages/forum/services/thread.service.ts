import { ThreadPage } from '../thread/thread.model';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { PostModel } from '../post/post.model';
import { AutoSaveHelper } from 'shared/helpers/auto-save.helper';
import { AutoSave } from '../forum.model';

@Injectable()
export class ThreadService implements Resolve<ThreadPage> {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<ThreadPage> {
        const threadId = route.params['id'];
        const page = route.params['page'];
        const postedByUser = route.params['postedByUser'] ? `/${route.params['postedByUser']}` : '';

        return this._httpService.get(`page/thread/${threadId}/page/${page}${postedByUser}`)
            .pipe(map(res => new ThreadPage(res)));
    }

    updatePost (post: PostModel): Observable<PostModel> {
        return this._httpService.put(`forum/thread/post/${post.postId}`, { post: post })
            .pipe(map(res => {
                AutoSaveHelper.remove(AutoSave.POST_EDIT, post.postId);
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Post updated!'
                }));

                return new PostModel(res);
            }), catchError(error => {
                this._notificationService.failureNotification(error);
                return throwError(null);
            }));
    }

    createPost (threadId: number, content: string, toggleThread: boolean): Observable<PostModel> {
        return this._httpService.post(`forum/thread/${threadId}`, { content: content, toggleThread: toggleThread })
            .pipe(map(res => {
                return new PostModel(res);
            }), catchError(error => {
                this._notificationService.failureNotification(error);
                return throwError(null);
            }));
    }

    markBadgeCompleted (badgeIds: Array<string>): Observable<void> {
        return this._httpService.post(`usercp/badge/complete`, { habboBadgeIds: badgeIds })
            .pipe(catchError(error => {
                this._notificationService.failureNotification(error);
                return throwError(null);
            }));
    }

    toggleSubscription (thread: ThreadPage): Observable<boolean> {
        const call = thread.isSubscribed ?
            this._httpService.delete(`forum/thread/unsubscribe/${thread.threadId}`) :
            this._httpService.post(`forum/thread/subscribe/${thread.threadId}`, null);

        return call.pipe(map(() => {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Success',
                message: `You ${thread.isSubscribed ? 'unsubscribed' : 'subscribed'} to the thread`
            }));
            return !thread.isSubscribed;
        }), catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    toggleIgnore (thread: ThreadPage): Observable<boolean> {
        const call = thread.isIgnored ?
            this._httpService.delete(`forum/thread/${thread.threadId}/ignore`) :
            this._httpService.post(`forum/thread/${thread.threadId}/ignore`, null);

        return call.pipe(map(() => {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Success',
                message: `You ${thread.isIgnored ? 'unignored' : 'ignored'} the thread`
            }));
            return !thread.isIgnored;
        }), catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }
}
