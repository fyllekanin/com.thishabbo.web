import { Component, Input } from '@angular/core';
import { ShopSubscription } from '../../shop.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-shop-subscription',
    templateUrl: 'subscription.component.html',
    styleUrls: ['subscription.component.css']
})
export class SubscriptionComponent {
    @Input() subscription = new ShopSubscription(null);

    constructor (
        private _dialogService: DialogService,
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    buy (): void {
        this._dialogService.confirm({
            title: 'Are you sure?',
            content: `Are you sure you wanna buy 1 month of ${this.subscription.title}?`,
            callback: () => {
                this._httpService.post(`shop/subscriptions/buy/${this.subscription.subscriptionId}`, null)
                    .subscribe(() => {
                        this._dialogService.closeDialog();
                        this._notificationService.sendInfoNotification('The purchase is done!');
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }
}
