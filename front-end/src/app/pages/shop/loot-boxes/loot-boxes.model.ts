import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { ShopLootBox } from '../shop.model';

export class LootBoxesPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(ShopLootBox)
    items: Array<ShopLootBox> = [];

    constructor (source: Partial<LootBoxesPage>) {
        ClassHelper.assign(this, source);
    }
}
