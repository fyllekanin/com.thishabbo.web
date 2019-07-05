import { arrayOf, ClassHelper, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { LOOT_BOXES } from 'shared/constants/shop.constants';

export class LootBoxItem {
    @primitive()
    shopItemId: number;
    @primitive()
    title: string;
    @primitive()
    rarity: number;
    @primitive()
    type: number;

    constructor (source: Partial<LootBoxItem>) {
        ClassHelper.assign(this, source);
    }
}

export class LootBoxItemsPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(LootBoxItem)
    items: Array<LootBoxItem> = [];

    constructor (source: Partial<LootBoxItemsPage>) {
        ClassHelper.assign(this, source);
    }
}

export class LootBoxModel {
    @primitive()
    lootBoxId: number;
    @primitive()
    title: string;
    @primitiveOf(Number)
    boxId = 1;
    @primitive()
    credits: number;
    @arrayOf(LootBoxItem)
    items: Array<LootBoxItem> = [];
    @primitive()
    createdAt: number;

    constructor (source: Partial<LootBoxModel>) {
        ClassHelper.assign(this, source);
    }

    get boxUrl (): string {
        const box = LOOT_BOXES.find(item => item.id === this.boxId);
        return box ? box.asset : '';
    }
}

export enum LootBoxActions {
    SAVE,
    DELETE,
    BACK,
    ADD_ITEM
}
