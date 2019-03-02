import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class PrefixCategory {
    @primitive()
    title: string;
    @primitive()
    categoryId: number;
    @arrayOf(PrefixCategory)
    children: Array<PrefixCategory> = [];

    constructor(source: Partial<PrefixCategory>) {
        ClassHelper.assign(this, source);
    }
}

export class Prefix {
    @primitive()
    prefixId: number;
    @primitive()
    text: string;
    @primitive()
    style: string;
    @arrayOf(PrefixCategory)
    categories: Array<PrefixCategory> = [];
    @arrayOf(Number)
    categoryIds: Array<number> = [];
    @primitive()
    createdAt: number;

    constructor(source?: Partial<Prefix>) {
        ClassHelper.assign(this, source);
    }
}

export enum PrefixActions {
    EDIT_PREFIX,
    DELETE_PREFIX,
    SAVE,
    DELETE,
    CANCEL
}
