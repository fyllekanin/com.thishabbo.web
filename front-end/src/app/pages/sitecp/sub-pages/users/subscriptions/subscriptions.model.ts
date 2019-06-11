import { arrayOf, ClassHelper, objectOf, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export interface UserSubscriptionPayload {
    subscriptionId?: number;
    userSubscriptionId?: number;
    expiresAt: number;
}

export class UserSubscriptionItem {
    @primitive()
    userSubscriptionId: number;
    @primitive()
    title: string;
    @primitiveOf(Number)
    subscriptionId = 0;
    @primitive()
    createdAt: number;
    @primitive()
    expiresAt: number;

    constructor (source: Partial<UserSubscriptionItem>) {
        ClassHelper.assign(this, source);
    }
}

export class SlimSubscription {
    @primitive()
    subscriptionId: number;
    @primitive()
    title: string;

    constructor (source: Partial<SlimSubscription>) {
        ClassHelper.assign(this, source);
    }
}

export class UserSubscriptionsPage {
    @objectOf(SlimUser)
    user: SlimUser;
    @arrayOf(UserSubscriptionItem)
    userSubscriptions: Array<UserSubscriptionItem> = [];
    @arrayOf(SlimSubscription)
    subscriptions: Array<SlimSubscription> = [];

    constructor (source: Partial<UserSubscriptionsPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum UserSubscriptionsAction {
    UPDATE,
    DELETE
}
