import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SHOP_ITEM_TYPES } from 'shared/constants/shop.constants';
import { SlimSubscription } from '../../users/subscriptions/subscriptions.model';

export class ShopItemData {
    @primitive()
    subscriptionTime: number;
    @primitive()
    subscriptionId: number;

    constructor (source: Partial<ShopItemData>) {
        ClassHelper.assign(this, source);
    }
}

export class ShopItem {
    @primitive()
    shopItemId: number;
    @primitive()
    title: string;
    @primitive()
    description: string;
    @primitive()
    rarity: number;
    @primitive()
    type: number;
    @objectOf(ShopItemData)
    data = new ShopItemData(null);
    @primitive()
    createdAt: number;

    @arrayOf(SlimSubscription)
    subscriptions: Array<SlimSubscription> = [];

    constructor (source: Partial<ShopItem>) {
        ClassHelper.assign(this, source);
    }

    get isNameIcon (): boolean {
        return this.type === SHOP_ITEM_TYPES.nameIcon.value;
    }

    get isNameEffect (): boolean {
        return this.type === SHOP_ITEM_TYPES.nameEffect.value;
    }

    get isSubscription (): boolean {
        return this.type === SHOP_ITEM_TYPES.subscription.value;
    }

    getResource (): string {
        if (this.isNameEffect || this.isNameIcon) {
            return `<img src="/rest/resources/images/shop/${this.shopItemId}.gif" />`;
        }
        return '<em class="far fa-address-card" style="font-size: 14px;"></em>';
    }
}

export enum ShopItemActions {
    SAVE,
    DELETE,
    BACK
}
