import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { catchError, map } from 'rxjs/operators';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { CategorySubscription } from '../category-subscriptions/category-subscriptions.model';

@Injectable()
export class UsercpCategorySubscriptionsService implements Resolve<Array<CategorySubscription>> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {}

    unsubscribe(categoryId: number): Observable<void> {
        return this._httpService.delete(`forum/category/${categoryId}/unsubscribe`)
            .pipe(catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }

    resolve(): Observable<Array<CategorySubscription>> {
        return this._httpService.get('usercp/category-subscriptions')
            .pipe(map(res => {
                return res.map(item => new CategorySubscription(item));
            }));
    }
}
