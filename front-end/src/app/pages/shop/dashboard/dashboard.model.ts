import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { ShopLootBox, ShopSubscription } from '../shop.model';
import { SHOP_ITEM_RARITIES } from 'shared/constants/shop.constants';
import { ShopHelper } from 'shared/helpers/shop.helper';

export class RotatedItem {
    @primitive()
    shopItemId: number;
    @primitive()
    rarity: number;
    @primitive()
    title: string;
    @primitive()
    credits: number;
    @primitive()
    type: number;
    @primitive()
    badgeId: number;

    rarityItem: { label: string, value: number, color: string };
    assetUrl: string;

    constructor (source: Partial<RotatedItem>) {
        ClassHelper.assign(this, source);
        const rarityKey = Object.keys(SHOP_ITEM_RARITIES).find(key => {
            return SHOP_ITEM_RARITIES[key].value === this.rarity;
        });
        this.rarityItem = SHOP_ITEM_RARITIES[rarityKey];
        this.assetUrl = ShopHelper.getItemResourceUrl(this.badgeId || this.shopItemId, this.type);
    }
}

export class DashboardModel {
    @arrayOf(RotatedItem)
    rotatedItems: Array<RotatedItem> = [];
    @arrayOf(ShopLootBox)
    lootBoxes: Array<ShopLootBox> = [];
    @arrayOf(ShopSubscription)
    subscriptions: Array<ShopSubscription> = [];

    constructor (source: Partial<DashboardModel>) {
        ClassHelper.assign(this, source);
    }
}
