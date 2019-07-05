import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ListCategory {
    @primitive()
    categoryId: number;
    @primitive()
    title: string;
    @primitive()
    displayOrder: number;
    @primitive()
    isHidden: boolean;
    @arrayOf(ListCategory)
    children: Array<ListCategory> = [];

    constructor (source: Partial<ListCategory>) {
        ClassHelper.assign(this, source);
    }
}

export enum CategoryListActions {
    EDIT_CATEGORY,
    DELETE_CATEGORY,
    EDIT_PERMISSIONS,
    SAVE_ORDER,
    TOGGLE_CATEGORY
}
