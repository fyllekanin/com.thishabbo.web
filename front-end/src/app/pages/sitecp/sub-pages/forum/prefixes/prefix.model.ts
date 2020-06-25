import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { CategoryLeaf } from '../category/category.model';

export class Prefix {
    @primitive()
    prefixId: number;
    @primitive()
    text: string;
    @primitive()
    style: string;
    @arrayOf(CategoryLeaf)
    categories: Array<CategoryLeaf> = [];
    @arrayOf(Number)
    categoryIds: Array<number> = [];
    @primitive()
    createdAt: number;

    constructor (source?: Partial<Prefix>) {
        ClassHelper.assign(this, source);
    }
}

export class PrefixListPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(Prefix)
    items: Array<Prefix> = [];

    constructor (source?: Partial<PrefixListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum PrefixActions {
    EDIT_PREFIX,
    DELETE_PREFIX,
    SAVE,
    DELETE,
    BACK
}
