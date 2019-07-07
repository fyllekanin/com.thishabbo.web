import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { LOOT_BOXES, SHOP_ITEM_RARITIES } from 'shared/constants/shop.constants';
import { ShopItemData } from '../sitecp/sub-pages/shop/items/items.model';

export class LootBoxResponse {
    @primitive()
    isRefund: boolean;
    @primitive()
    amount: number;
    @primitive()
    shopItemId: number;

    constructor (source: Partial<LootBoxResponse>) {
        ClassHelper.assign(this, source);
    }
}

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
    @objectOf(ShopItemData)
    data = new ShopItemData(null);

    constructor (source: Partial<ShopLootBoxItem>) {
        ClassHelper.assign(this, source);
    }

    get color (): string {
        const rarityKey = Object.keys(SHOP_ITEM_RARITIES).find(key => SHOP_ITEM_RARITIES[key].value === this.rarity);
        return SHOP_ITEM_RARITIES[rarityKey].color;
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
