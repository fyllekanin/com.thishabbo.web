import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { SubscriptionsListPage } from '../subscriptions/list/list.model';
import { Observable } from 'rxjs';
import { QueryParameters } from 'core/services/http/http.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class SubscriptionsListService implements Resolve<SubscriptionsListPage> {

    constructor (
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _notificationService: NotificationService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<SubscriptionsListPage> {
        const page = route.params['page'];

        return this.getPage(page, {filter: route.queryParams['filter']});
    }

    getPage (page: number, filter: QueryParameters): Observable<SubscriptionsListPage> {
        return this._httpService.get(`admin/shop/subscriptions/page/${page}`, filter)
            .pipe(map(res => new SubscriptionsListPage(res)));
    }

    delete (subscriptionId: number): Promise<void> {
        return new Promise(res => {
            this._dialogService.openConfirmDialog(
                'Are you sure?',
                'Are you sure you wanna delete this subscription?',
                () => {
                    this._httpService.delete(`admin/shop/subscriptions/${subscriptionId}`)
                        .subscribe(() => {
                            this._notificationService.sendInfoNotification('Subscription deleted');
                            this._dialogService.closeDialog();
                            res();
                        }, this._notificationService.failureNotification.bind(this._notificationService));
                }
            );
        });
    }
}
