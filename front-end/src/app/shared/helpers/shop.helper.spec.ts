import { ShopHelper } from 'shared/helpers/shop.helper';
import { SHOP_ITEM_RARITIES, SHOP_ITEM_TYPES } from 'shared/constants/shop.constants';

describe('ShopHelper', () => {

    describe('getTypeName', () => {
        it('should return empty string if invalid type', () => {
            // Given
            const type = -5;

            // When
            const result = ShopHelper.getTypeName(type);

            // Then
            expect(result).toEqual('');
        });

        it('should return correct string if valid type', () => {
            // Given
            const type = SHOP_ITEM_TYPES.badge;

            // When
            const result = ShopHelper.getTypeName(type.value);

            // Then
            expect(result).toEqual(type.label);
        });
    });

    describe('getRarityName', () => {
        it('should return empty string if invalid rarity', () => {
            // Given
            const rarity = -5;

            // When
            const result = ShopHelper.getRarityName(rarity);

            // Then
            expect(result).toEqual('');
        });

        it('should return correct string if valid rarity', () => {
            // Given
            const type = SHOP_ITEM_RARITIES.legendary;

            // When
            const result = ShopHelper.getRarityName(type.value);

            // Then
            expect(result).toEqual(type.label);
        });
    });
});
