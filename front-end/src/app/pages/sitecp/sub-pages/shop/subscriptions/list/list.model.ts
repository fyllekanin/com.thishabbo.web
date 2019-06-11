import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class SlimSubscriptionItem {
    @primitive()
    subscriptionId: number;
    @primitive()
    title: string;
    @primitive()
    membersCount: number;

    constructor (source: Partial<SlimSubscriptionItem>) {
        ClassHelper.assign(this, source);
    }
}

export class SubscriptionsListPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(SlimSubscriptionItem)
    items: Array<SlimSubscriptionItem> = [];

    constructor (source: Partial<SubscriptionsListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum SubscriptionListAction {
    EDIT,
    DELETE
}
