import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class GroupModerate {
    @primitive()
    groupRequestId: number;
    @primitive()
    nickname: string;
    @primitive()
    userId: number;
    @primitive()
    name: string;
    @primitive()
    groupId: number;
    @primitive()
    createdAt: number;

    constructor (source: Partial<GroupModerate>) {
        ClassHelper.assign(this, source);
    }
}

export enum GroupModerationActions {
    APPROVE_REQUEST,
    DENY_REQUEST
}
