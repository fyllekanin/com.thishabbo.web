import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SubscriptionItem } from '../subscriptions/subscriptions.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class SubscriptionService implements Resolve<SubscriptionItem> {

    constructor (
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _notificationService: NotificationService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<SubscriptionItem> {
        const subscriptionId = route.params['subscriptionId'];

        return subscriptionId === 'new' ? of(new SubscriptionItem(null)) :
            this._httpService.get(`admin/shop/subscriptions/${subscriptionId}`)
                .pipe(map(res => new SubscriptionItem(res)));
    }

    save (data: SubscriptionItem): Promise<void> {
        return new Promise(res => {
            this._httpService.post(`admin/shop/subscriptions`, {data: data})
                .subscribe(() => {
                    this._notificationService.sendInfoNotification('Subscription created');
                    res();
                }, this._notificationService.failureNotification.bind(this._notificationService));
        });
    }

    update (data: SubscriptionItem): Promise<void> {
        return new Promise(res => {
            this._httpService.put(`admin/shop/subscriptions/${data.subscriptionId}`, {data: data})
                .subscribe(() => {
                    this._notificationService.sendInfoNotification('Subscription updated');
                    res();
                }, this._notificationService.failureNotification.bind(this._notificationService));
        });
    }

    delete (data: SubscriptionItem): Promise<void> {
        return new Promise(res => {
            this._dialogService.openConfirmDialog(
                'Are you sure?',
                'Are you sure you wanna delete this subscription?',
                () => {
                    this._httpService.delete(`admin/shop/subscriptions/${data.subscriptionId}`)
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
