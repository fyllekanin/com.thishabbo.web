import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class BetCategoryModel {
    @primitive()
    betCategoryId: number;
    @primitive()
    name: string;
    @primitive()
    displayOrder: number;
    @primitive()
    createdAt: number;

    constructor(source: Partial<BetCategoryModel>) {
        ClassHelper.assign(this, source);
    }
}

export class CategoriesListPage {
    @arrayOf(BetCategoryModel)
    betCategories: Array<BetCategoryModel> = [];
    @primitive()
    page: number;
    @primitive()
    total: number;

    constructor(source: Partial<CategoriesListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum BetCategoryActions {
    EDIT_CATEGORY,
    DELETE_CATEGORY,
    SAVE,
    CANCEL,
    DELETE
}
