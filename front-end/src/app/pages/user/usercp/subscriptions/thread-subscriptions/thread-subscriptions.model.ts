import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ThreadSubscription {
    @primitive()
    threadId: number;
    @primitive()
    title: string;

    constructor(source: Partial<ThreadSubscription>) {
        ClassHelper.assign(this, source);
    }
}

export enum ThreadSubscriptionActions {
    UNSUBSCRIBE
}
