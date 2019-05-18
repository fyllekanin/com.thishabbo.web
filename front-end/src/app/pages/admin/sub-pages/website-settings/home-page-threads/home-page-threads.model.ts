import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

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
    @arrayOf(HomePageCategory)
    categories: Array<HomePageCategory> = [];

    constructor (source: Partial<HomePageThreadsPage>) {
        ClassHelper.assign(this, source);
    }
}