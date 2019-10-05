import { ClassHelper, objectOf, primitive, primitiveOf, dateAndTime } from 'shared/helpers/class.helper';

export class SubscriptionOptions {
    @primitive()
    canHaveCustomNameColor: boolean;
    @primitive()
    canMoveNamePosition: boolean;
    @primitive()
    isListed: boolean;
    @primitive()
    canHaveCustomBar: boolean;

    constructor (source?: Partial<SubscriptionOptions>) {
        ClassHelper.assign(this, source);
    }
}

export class SubscriptionItem {
    @primitive()
    subscriptionId: number;
    @primitive()
    title: string;
    @primitiveOf(Number)
    avatarWidth = 0;
    @primitiveOf(Number)
    avatarHeight = 0;
    @primitiveOf(Number)
    credits = 0;
    @primitiveOf(Number)
    pounds = 0;
    @objectOf(SubscriptionOptions)
    options = new SubscriptionOptions();
    @dateAndTime()
    createdAt: string;

    constructor (source: Partial<SubscriptionItem>) {
        ClassHelper.assign(this, source);
    }
}
