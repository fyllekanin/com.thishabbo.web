import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { ShopSubscription } from '../shop.model';

export class SubscriptionsPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(ShopSubscription)
    items: Array<ShopSubscription> = [];

    constructor (source: Partial<SubscriptionsPage>) {
        ClassHelper.assign(this, source);
    }
}
