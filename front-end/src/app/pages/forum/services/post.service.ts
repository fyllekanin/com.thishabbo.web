import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SlimUser } from 'core/services/auth/auth.model';

@Injectable()
export class PostService {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    reportPost (postId: number, message: string): Observable<void> {
        return this._httpService.post(`forum/moderation/post/report`, { postId: postId, message: message })
            .pipe(map(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'You reported the post'
                }));
            }), catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    likePost (postId: number): Observable<Array<SlimUser>> {
        return this._httpService.post(`forum/thread/like/post/${postId}`, null)
            .pipe(map(data => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'You liked the post!'
                }));
                return data.map(liker => new SlimUser(liker));
            }), catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    unlikePost (postId: number): Observable<Array<SlimUser>> {
        return this._httpService.delete(`forum/thread/unlike/post/${postId}`, null)
            .pipe(map(data => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'You unliked the post!'
                }));
                return data.map(liker => new SlimUser(liker));
            }), catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }
}
