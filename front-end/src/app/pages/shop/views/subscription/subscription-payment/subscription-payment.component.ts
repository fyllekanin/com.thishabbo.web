import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { ShopSubscription } from '../../../shop.model';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-shop-subscriptions-payment',
    templateUrl: 'subscription-payment.component.html',
    styles: [`button {
        width: 100%;
    }`]
})
export class SubscriptionPaymentComponent extends InnerDialogComponent {
    private _data: ShopSubscription;

    paypalConfig: IPayPalConfig;
    showSuccess: boolean;

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
        super();
    }

    setData (subscription: ShopSubscription) {
        this._data = subscription;
        if (this._data.pounds > 0) {
            this.setConfig();
        }
    }

    getData () {
        // Empty
    }

    buyWithCredits (): void {
        this._httpService.post(`shop/subscriptions/buy/${this._data.subscriptionId}`, null)
            .subscribe(() => {
                this._notificationService.sendInfoNotification('The purchase is done!');
                this.showSuccess = true;
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private setConfig (): void {
        this.paypalConfig = {
            currency: 'GBP',
            clientId: 'AY93kR0Gr1VxHYUKW47FNfu1dwMjwgOQ5oKjLlM8Iiwkku8UvgOqJ9sj0C7jrzjiIL1vRdbzqmoMHxKW',
            createOrderOnClient: () => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'GBP',
                        value: String(this._data.pounds),
                        breakdown: {
                            item_total: {
                                currency_code: 'GBP',
                                value: String(this._data.pounds)
                            }
                        }
                    },
                    items: [{
                        name: this._data.title,
                        quantity: '1',
                        category: 'DIGITAL_GOODS',
                        unit_amount: {
                            currency_code: 'GBP',
                            value: String(this._data.pounds)
                        }
                    }]
                }]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            onApprove: (data, actions) => {
                console.log('onApprove - transaction was approved, but not authorized', data, actions);
                actions.order.get().then(details => {
                    console.log('onApprove - you can get full order details inside onApprove: ', details);
                });

            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
                this.showSuccess = true;
            }
        };
    }
}