import { arrayOf, ClassHelper } from 'shared/helpers/class.helper';
import { ShopLootBox, ShopSubscription } from '../shop.model';

export class DashboardPage {
    @arrayOf(ShopLootBox)
    lootBoxes: Array<ShopLootBox> = [];
    @arrayOf(ShopSubscription)
    subscriptions: Array<ShopSubscription> = [];

    constructor (source: Partial<DashboardPage>) {
        ClassHelper.assign(this, source);
    }
}
