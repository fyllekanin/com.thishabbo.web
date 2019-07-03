import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class SlimLootBox {
    @primitive()
    lootBoxId: number;
    @primitive()
    title: string;
    @primitive()
    items: number;

    constructor (source: Partial<SlimLootBox>) {
        ClassHelper.assign(this, source);
    }
}

export class LootBoxesListPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(SlimLootBox)
    items: Array<SlimLootBox> = [];

    constructor (source: Partial<LootBoxesListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum LootBoxesListActions {
    EDIT,
    DELETE
}
