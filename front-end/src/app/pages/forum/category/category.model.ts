import { ClassHelper, objectOf } from 'shared/helpers/class.helper';
import { ForumPermissions, SlimCategory, SlimThread } from '../forum.model';
import { primitive, arrayOf } from 'shared/helpers/class.helper';

export enum CATEGORY_SORT_BY {
    THREAD_TITLE = 'THREAD_TITLE',
    LAST_POST_TIME = 'LAST_POST_TIME',
    THREAD_START_TIME = 'THREAD_START_TIME',
    NUMBER_OF_REPLIES = 'NUMBER_OF_REPLIES'
}

export enum SORT_ORDER {
    ASC = 'ASC',
    DESC = 'DESC'
}

export enum TIME_CONSTRAINTS {
    LAST_DAY = 'Last Day',
    LAST_TWO_DAYS = 'Last 2 Days',
    LAST_WEEK = 'Last Week',
    LAST_TEN_DAYS = 'Last 10 days',
    LAST_TWO_WEEKS = 'Last 2 Weeks',
    LAST_MONTH = 'Last Month',
    LAST_FORTY_FIVE_DAYS = 'Last 45 Days',
    LAST_TWO_MONTHS = 'Last 2 Months',
    LAST_SEVENTY_FIVE_DAYS = 'Last 75 Days',
    LAST_HUNDRED_DAYS = 'Last 100 Days',
    LAST_YEAR = 'Last Year',
    BEGINNING = 'Beginning'
}

export class CategoryDisplayOptions {
    @primitive()
    sortedBy: string;
    @primitive()
    sortOrder: string;
    @primitive()
    fromThe: string;

    constructor(source?: Partial<CategoryDisplayOptions>) {
        ClassHelper.assign(this, source);
        this.sortedBy = this.sortedBy || CATEGORY_SORT_BY.LAST_POST_TIME;
        this.sortOrder = this.sortOrder || SORT_ORDER.DESC;
        this.fromThe = this.fromThe || TIME_CONSTRAINTS.BEGINNING.toUpperCase();
    }
}

export class CategoryParent {
    @primitive()
    categoryId: number;
    @primitive()
    title: string;
    @primitive()
    parentId: number;
    @primitive()
    displayOrder: number;

    constructor(source: Partial<CategoryParent>) {
        ClassHelper.assign(this, source);
    }
}

export class CategoryPage {
    @primitive()
    categoryId: number;
    @primitive()
    title: string;
    @arrayOf(CategoryParent)
    parents: Array<CategoryParent> = [];
    @arrayOf(SlimCategory)
    categories: Array<SlimCategory> = [];
    @arrayOf(SlimThread)
    stickyThreads: Array<SlimThread> = [];
    @arrayOf(SlimThread)
    threads: Array<SlimThread> = [];
    @objectOf(ForumPermissions)
    forumPermissions: ForumPermissions;
    @primitive()
    isOpen: boolean;
    @primitive()
    total: number;
    @primitive()
    page: number;
    @objectOf(CategoryDisplayOptions)
    displayOptions: CategoryDisplayOptions;
    @primitive()
    isSubscribed: boolean;
    @primitive()
    isIgnored: boolean;

    constructor(source?: Partial<CategoryPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum CategoryActions {
    SUBSCRIBE,
    UNSUBSCRIBE,
    IGNORE,
    UNIGNORE
}
