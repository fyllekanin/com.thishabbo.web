import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { ShopItem } from '../items.model';

export class ShopListPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(ShopItem)
    items: Array<ShopItem> = [];

    constructor(source: Partial<ShopListPage>) {
        ClassHelper.assign(this, source);
    }
}
