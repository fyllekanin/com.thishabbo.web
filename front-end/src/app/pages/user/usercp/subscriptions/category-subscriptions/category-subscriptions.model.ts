import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class CategorySubscription {
    @primitive()
    categoryId: number;
    @primitive()
    title: string;

    constructor(source: Partial<CategorySubscription>) {
        ClassHelper.assign(this, source);
    }
}

export enum CategorySubscriptionActions {
    UNSUBSCRIBE
}
