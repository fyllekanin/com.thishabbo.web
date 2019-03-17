import { primitive, ClassHelper, arrayOf, objectOf } from 'shared/helpers/class.helper';

export class UserCpGroup {
    @primitive()
    groupRequestId: number;
    @primitive()
    name: string;
    @primitive()
    groupId: number;
    @primitive()
    isMember: boolean;
    @primitive()
    haveApplied: boolean;
    @primitive()
    isPublic: boolean;

    constructor(source: Partial<UserCpGroup>) {
        ClassHelper.assign(this, source);
    }
}

export class UserCpGroupsPage {
    @arrayOf(UserCpGroup)
    groups: Array<UserCpGroup> = [];
    @objectOf(UserCpGroup)
    displayGroup: UserCpGroup;

    constructor(source: Partial<UserCpGroupsPage>) {
        ClassHelper.assign(this, source);
    }
}
