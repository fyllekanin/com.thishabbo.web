import { AdminPermissions, StaffPermissions } from 'core/services/auth/auth.model';
import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class GroupOptions {
    @primitive()
    contentNeedApproval: boolean;
    @primitive()
    canBeTagged: boolean;

    constructor(source?: Partial<GroupOptions>) {
        ClassHelper.assign(this, source);
    }
}

export class Group {
    @objectOf(AdminPermissions)
    adminPermissions: AdminPermissions;
    @objectOf(StaffPermissions)
    staffPermissions: StaffPermissions;
    @primitive()
    name: string;
    @primitive()
    immunity: number;
    @primitive()
    maxImmunity: number;
    @primitive()
    groupId: number;
    @primitive()
    createdAt: number;
    @primitive()
    updatedAt: number;
    @primitive()
    nameStyling: string;
    @primitive()
    userBarStyling: string;
    @primitive()
    isPublic: boolean;
    @objectOf(GroupOptions)
    options: GroupOptions;
    @primitive()
    avatarWidth: number;
    @primitive()
    avatarHeight: number;

    constructor(source?: Partial<Group>) {
        ClassHelper.assign(this, source);
    }
}

export enum GroupActions {
    CANCEL,
    SAVE,
    DELETE
}

