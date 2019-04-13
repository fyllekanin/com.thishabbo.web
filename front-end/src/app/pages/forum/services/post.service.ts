import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class PostService {

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {}

    reportPost(postId: number, message: string): Observable<void> {
        return this._httpService.post(`forum/moderation/post/report`, { postId: postId, message: message })
            .pipe(map(() => {
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'You reported the post'
                }));
            }), catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    likePost(postId: number): Observable<void> {
        return this._httpService.post(`forum/thread/like/post/${postId}`, null)
            .pipe(map(() => {
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'You liked the post!'
                }));
            }), catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    unlikePost(postId: number): Observable<void> {
        return this._httpService.delete(`forum/thread/unlike/post/${postId}`, null)
            .pipe(map(() => {
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'You unliked the post!'
                }));
            }), catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }
}
