import { Component, Input } from '@angular/core';
import { ShopSubscription } from '../../shop.model';
import { DialogService } from 'core/services/dialog/dialog.service';

@Component({
    selector: 'app-shop-subscription',
    templateUrl: 'subscription.component.html',
    styleUrls: ['subscription.component.css']
})
export class SubscriptionComponent {
    @Input() subscription = new ShopSubscription(null);

    constructor (private _dialogService: DialogService) {
    }

    buy (): void {
        this._dialogService.confirm({
            title: 'Are you sure?',
            content: `Are you sure you wanna buy 1 month of ${this.subscription.title}?`,
            callback: () => {
                this._dialogService.closeDialog();
            }
        });
    }
}
