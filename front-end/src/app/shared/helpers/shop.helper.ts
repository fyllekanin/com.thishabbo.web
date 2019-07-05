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
}
