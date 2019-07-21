import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { ShopSubscription } from '../../../shop.model';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';

@Component({
    selector: 'app-shop-subscriptions-payment',
    templateUrl: 'subscription-payment.component.html',
    styles: [
            `button {
            width: 100%;
        }`,
            `.lds-roller div:after {
            content: " ";
            display: block;
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #000;
            margin: -3px 0 0 -3px;
        }`,
            `.lds-roller {
            left: calc(50% - 64px);
        }`
    ]
})
export class SubscriptionPaymentComponent extends InnerDialogComponent {
    private _data: ShopSubscription;

    paypalConfig: IPayPalConfig;
    showSuccess = false;
    isLoading = false;

    successMessage: InfoBoxModel = {
        type: INFO_BOX_TYPE.INFO,
        title: 'Success!',
        content: 'Your subscription is now added on your account!'
    };

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
        super();
    }

    setData (subscription: ShopSubscription) {
        this.isLoading = false;
        this.showSuccess = false;
        this._data = subscription;
        if (this._data.pounds > 0) {
            this.setConfig();
        }
    }

    getData () {
        // Empty
    }

    buyWithCredits (): void {
        this.isLoading = true;
        this._httpService.post(`shop/subscriptions/buy/${this._data.subscriptionId}`, null)
            .subscribe(() => {
                this._notificationService.sendInfoNotification('The purchase is done!');
                this.showSuccess = true;
                this.isLoading = false;
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private setConfig (): void {
        this.paypalConfig = {
            currency: 'GBP',
            clientId: 'AY93kR0Gr1VxHYUKW47FNfu1dwMjwgOQ5oKjLlM8Iiwkku8UvgOqJ9sj0C7jrzjiIL1vRdbzqmoMHxKW',
            createOrderOnClient: () => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [{
                    reference_id: String(this._data.subscriptionId),
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
            onApprove: () => {
            },
            onClientAuthorization: (data) => {
                this.isLoading = true;
                this._httpService.get(`shop/payment-verification/${data.id}`)
                    .subscribe(() => {
                        this.isLoading = false;
                        this.showSuccess = true;
                        this._notificationService.sendInfoNotification('Subscription bought!');
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        };
    }
}
