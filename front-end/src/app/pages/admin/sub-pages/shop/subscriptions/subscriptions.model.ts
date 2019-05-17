import { ClassHelper, objectOf, primitive, time } from 'shared/helpers/class.helper';

export class SubscriptionOptions {
    @primitive()
    canHaveCustomNameColor: boolean;
}

export class SubscriptionItem {
    @primitive()
    subscriptionId: number;
    @primitive()
    title: number;
    @primitive()
    avatarWidth: number;
    @primitive()
    avatarHeight: number;
    @primitive()
    credits: number;
    @primitive()
    pounds: number;
    @objectOf(SubscriptionOptions)
    options: SubscriptionOptions;
    @time()
    createdAt: string;

    constructor (source: Partial<SubscriptionItem>) {
        ClassHelper.assign(this, source);
    }
}
