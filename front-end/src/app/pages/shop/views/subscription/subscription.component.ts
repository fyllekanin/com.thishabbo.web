import { Component, ComponentFactoryResolver, Input } from '@angular/core';
import { ShopSubscription } from '../../shop.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { SubscriptionPaymentComponent } from './subscription-payment/subscription-payment.component';

@Component({
    selector: 'app-shop-subscription',
    templateUrl: 'subscription.component.html',
    styleUrls: ['subscription.component.css']
})
export class SubscriptionComponent {
    @Input() subscription = new ShopSubscription(null);

    constructor (
        private _dialogService: DialogService,
        private _componentResolver: ComponentFactoryResolver
    ) {
    }

    buy (): void {
        this._dialogService.openDialog({
            title: `Buy ${this.subscription.title}`,
            component: this._componentResolver.resolveComponentFactory(SubscriptionPaymentComponent),
            data: this.subscription,
            buttons: [new DialogCloseButton('Close')]
        });
    }
}
