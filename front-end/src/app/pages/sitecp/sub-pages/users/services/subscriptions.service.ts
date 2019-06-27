import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import {
    UserSubscriptionItem,
    UserSubscriptionPayload,
    UserSubscriptionsPage
} from '../subscriptions/subscriptions.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';

@Injectable()
export class SubscriptionsService implements Resolve<UserSubscriptionsPage> {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<UserSubscriptionsPage> {
        const userId = route.params['userId'];
        return this._httpService.get(`sitecp/users/${userId}/subscriptions`)
            .pipe(map(res => new UserSubscriptionsPage(res)));
    }

    create (userId: number, userSubscription: UserSubscriptionPayload): Promise<UserSubscriptionItem> {
        return new Promise(res => {
            this._httpService.post(`sitecp/users/${userId}/subscriptions`, {data: userSubscription})
                .subscribe(response => {
                    this._notificationService.sendInfoNotification('User subscription updated');
                    res(new UserSubscriptionItem(response));
                }, this._notificationService.failureNotification.bind(this._notificationService));
        });
    }

    update (userSubscription: UserSubscriptionPayload): void {
        this._httpService.put(`sitecp/users/subscriptions/${userSubscription.userSubscriptionId}`, {data: userSubscription})
            .subscribe(() => {
                this._notificationService.sendInfoNotification('User subscription updated');
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    delete (userSubscriptionId: number): Promise<void> {
        return new Promise(res => {
            this._dialogService.confirm({
                title: 'Delete User Subscription',
                content: 'Are you sure you want to delete this user subscription?',
                callback: () => {
                    this._httpService.delete(`sitecp/users/subscriptions/${userSubscriptionId}`)
                        .subscribe(() => {
                            this._notificationService.sendInfoNotification('User subscription deleted');
                            this._dialogService.closeDialog();
                            res();
                        }, this._notificationService.failureNotification.bind(this._notificationService));
                }
            });
        });
    }
}
