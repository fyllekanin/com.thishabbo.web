import { Component, Input } from '@angular/core';
import { ShopSubscription } from '../../shop.model';

@Component({
    selector: 'app-shop-subscription',
    templateUrl: 'subscription.component.html',
    styleUrls: ['subscription.component.css']
})
export class SubscriptionComponent {
    @Input() subscription = new ShopSubscription(null);
}
