import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class UserCpDashboardSubscription {
    @primitive()
    title: string;
    @primitive()
    expiresAt: number;

    constructor (source: Partial<UserCpDashboardSubscription>) {
        ClassHelper.assign(this, source);
    }
}

export class UserCpDashboardModel {
    @primitive()
    userId: number;
    @primitive()
    registerTimestamp: number;
    @primitive()
    itemsOwned: number;
    @primitive()
    likes: number;
    @arrayOf(UserCpDashboardSubscription)
    subscriptions: Array<UserCpDashboardSubscription> = [];

    constructor (source?: Partial<UserCpDashboardModel>) {
        ClassHelper.assign(this, source);
    }
}
