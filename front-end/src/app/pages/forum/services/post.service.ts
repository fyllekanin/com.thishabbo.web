import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class PostService {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {}

    reportPost(postId: number, message: string): Observable<void> {
        return this._httpService.post(`forum/moderation/post/report`, { postId: postId, message: message })
            .pipe(map(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'You reported the post'
                }));
            }), catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }

    likePost(postId: number): Observable<void> {
        return this._httpService.post(`forum/thread/like/post/${postId}`, null)
            .pipe(map(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'You liked the post!'
                }));
            }), catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }

    unlikePost(postId: number): Observable<void> {
        return this._httpService.delete(`forum/thread/unlike/post/${postId}`, null)
            .pipe(map(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'You unliked the post!'
                }));
            }), catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }
}
