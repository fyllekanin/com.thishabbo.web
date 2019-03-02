import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class CategoryModel {
    @primitive()
    shopCategoryId: number;
    @primitive()
    title: string;
    @primitive()
    description: string;
    @primitive()
    displayOrder: number;
    @primitive()
    createdAt: number;

    constructor(source?: Partial<CategoryModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum CategoryModelActions {
    SAVE,
    DELETE,
    CANCEL
}
