import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { LOOT_BOXES } from 'shared/constants/shop.constants';

export class ShopLootBoxItem {
    @primitive()
    shopItemId: number;
    @primitive()
    title: string;
    @primitive()
    rarity: number;
    @primitive()
    type: number;
    @primitive()
    owns: boolean;

    constructor (source: Partial<ShopLootBoxItem>) {
        ClassHelper.assign(this, source);
    }
}

export class ShopLootBox {
    @primitive()
    lootBoxId: number;
    @primitive()
    title: string;
    @primitive()
    credits: number;
    @primitive()
    boxId: number;
    @arrayOf(ShopLootBoxItem)
    items: Array<ShopLootBoxItem> = [];

    constructor (source: Partial<ShopLootBox>) {
        ClassHelper.assign(this, source);
    }

    get boxUrl (): string {
        const box = LOOT_BOXES.find(item => item.id === this.boxId);
        return box ? box.asset : '';
    }
}

export class ShopSubscriptionOptions {
    @primitive()
    customNameColor: boolean;
    @primitive()
    customNamePosition: boolean;
    @primitive()
    avatarWidth: number;
    @primitive()
    avatarHeight: number;

    constructor (source: Partial<ShopSubscriptionOptions>) {
        ClassHelper.assign(this, source);
    }
}

export class ShopSubscription {
    @primitive()
    subscriptionId: number;
    @primitive()
    title: string;
    @primitive()
    credits: number;
    @primitive()
    pounds: number;
    @primitive()
    expiresAt: number;
    @objectOf(ShopSubscriptionOptions)
    options: ShopSubscriptionOptions;

    constructor (source: Partial<ShopSubscriptionOptions>) {
        ClassHelper.assign(this, source);
    }
}
