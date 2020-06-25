import { SHOP_ITEM_RARITIES, SHOP_ITEM_TYPES } from 'shared/constants/shop.constants';

export class ShopHelper {

    static getTypeName (type: number): string {
        const typeKey = Object.keys(SHOP_ITEM_TYPES).find(key => {
            return SHOP_ITEM_TYPES[key].value === type;
        });
        return typeKey ? SHOP_ITEM_TYPES[typeKey].label : '';
    }

    static getRarityName (rarity: number): string {
        const rarityKey = Object.keys(SHOP_ITEM_RARITIES).find(key => {
            return SHOP_ITEM_RARITIES[key].value === rarity;
        });
        return rarityKey ? SHOP_ITEM_RARITIES[rarityKey].label : '';
    }

    static getItemResourceUrl (itemId: number, type: number): string {
        if (type === SHOP_ITEM_TYPES.nameEffect.value || type === SHOP_ITEM_TYPES.nameIcon.value) {
            return `/resources/images/shop/${itemId}.gif`;
        } else if (type === SHOP_ITEM_TYPES.badge.value) {
            return `/resources/images/badges/${itemId}.gif`;
        }
        return '';
    }

    static getItemResource (itemId: number, type: number): string {
        const resourceUrl = ShopHelper.getItemResourceUrl(itemId, type);
        return resourceUrl ? `<img src="${resourceUrl}" />` : '<em class="far fa-address-card" style="font-size: 14px;"></em>';
    }
}
