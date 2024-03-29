import { arrayOf, ClassHelper, objectOf, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { SHOP_ITEM_TYPES } from 'shared/constants/shop.constants';
import { SlimSubscription } from '../../users/subscriptions/subscriptions.model';
import { ShopHelper } from 'shared/helpers/shop.helper';

export class ShopItemData {
    @primitive()
    subscriptionTime: number;
    @primitive()
    subscriptionId: number;
    @primitive()
    badgeId: number;

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
    createdBy: string;
    @primitive()
    type: number;
    @objectOf(ShopItemData)
    data = new ShopItemData(null);
    @primitiveOf(Number)
    createdAt = new Date().getTime();

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

    get isBadge (): boolean {
        return this.type === SHOP_ITEM_TYPES.badge.value;
    }

    getResource (): string {
        const itemId = this.isBadge ? this.data.badgeId : this.shopItemId;
        return ShopHelper.getItemResource(itemId, this.type);
    }
}

export enum ShopItemActions {
    SAVE,
    DELETE,
    BACK
}
