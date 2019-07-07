import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { CategoryLeaf } from '../../forum/category/category.model';

export class HomePageCategory {
    @primitive()
    categoryId: number;
    @primitive()
    title: string;

    constructor (source: Partial<HomePageCategory>) {
        ClassHelper.assign(this, source);
    }
}

export class HomePageThreadsPage {
    @arrayOf(Number)
    categoryIds: Array<number> = [];
    @arrayOf(CategoryLeaf)
    categories: Array<CategoryLeaf> = [];

    constructor (source: Partial<HomePageThreadsPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum HomePageThreadsAction {
    SAVE,
    ADD
}
