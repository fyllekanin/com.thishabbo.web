import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { CategoryModel } from '../category/category.model';

export class CategoriesListPage {
    @primitive()
    page: number;
    @primitive()
    total: number;
    @arrayOf(CategoryModel)
    items: Array<CategoryModel> = [];

    constructor(source: Partial<CategoriesListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum CategoriesListActions {
    EDIT,
    DELETE
}
