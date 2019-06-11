import { ClassHelper, primitive } from 'shared/helpers/class.helper';

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

    constructor(source: Partial<ShopItem>) {
        ClassHelper.assign(this, source);
    }
}
