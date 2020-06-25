import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { User } from 'core/services/auth/auth.model';

export class ThcRequestModel {
    @primitive()
    requestThcId: number;
    @primitive()
    amount: number;
    @primitive()
    reason: string;
    @objectOf(User)
    receiver: User;
    @objectOf(User)
    requester: User;

    constructor (source: Partial<ThcRequestModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum ThcRequestActions {
    APPROVE_REQUEST,
    DENY_REQUEST
}
