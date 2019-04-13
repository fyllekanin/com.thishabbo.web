import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from 'core/services/notification/notification.service';
import { CategorySubscription } from '../category-subscriptions/category-subscriptions.model';

@Injectable()
export class CategorySubscriptionsService implements Resolve<Array<CategorySubscription>> {

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {}

    unsubscribe(categoryId: number): Observable<void> {
        return this._httpService.delete(`forum/category/${categoryId}/unsubscribe`)
            .pipe(catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    resolve(): Observable<Array<CategorySubscription>> {
        return this._httpService.get('usercp/category-subscriptions')
            .pipe(map(res => {
                return res.map(item => new CategorySubscription(item));
            }));
    }
}
