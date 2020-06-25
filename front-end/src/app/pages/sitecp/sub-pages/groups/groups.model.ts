import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class GroupOptions {
    @primitive()
    contentNeedApproval: boolean;

    constructor (source?: Partial<GroupOptions>) {
        ClassHelper.assign(this, source);
    }
}

export class Permission {
    @primitive()
    isActive: boolean;
    @primitive()
    isDisabled: boolean;

    constructor (source?: Partial<Permission>) {
        ClassHelper.assign(this, source);
    }
}

export class GroupSiteCpPermissions {
    @objectOf(Permission)
    isSitecp: Permission;
    @objectOf(Permission)
    canManageCategories: Permission;
    @objectOf(Permission)
    canManageCategoryPermissions: Permission;
    @objectOf(Permission)
    canManageGroups: Permission;
    @objectOf(Permission)
    canEditWebsiteSettings: Permission;
    @objectOf(Permission)
    canModerateThreads: Permission;
    @objectOf(Permission)
    canModeratePosts: Permission;
    @objectOf(Permission)
    canApprovePublicGroups: Permission;
    @objectOf(Permission)
    canManageBBcodes: Permission;
    @objectOf(Permission)
    canManagePrefixes: Permission;
    @objectOf(Permission)
    canManageGroupsList: Permission;
    @objectOf(Permission)
    canEditUsersBasic: Permission;
    @objectOf(Permission)
    canEditUsersAdvanced: Permission;
    @objectOf(Permission)
    canBanUsers: Permission;
    @objectOf(Permission)
    canMergeUsers: Permission;
    @objectOf(Permission)
    canManageBadges: Permission;
    @objectOf(Permission)
    canManageBetting: Permission;
    @objectOf(Permission)
    canManageCredits: Permission;
    @objectOf(Permission)
    canManagePolls: Permission;
    @objectOf(Permission)
    canSeeIps: Permission;
    @objectOf(Permission)
    canManageInfractions: Permission;
    @objectOf(Permission)
    canDoInfractions: Permission;
    @objectOf(Permission)
    canSeeLogs: Permission;
    @objectOf(Permission)
    canManageShop: Permission;
    @objectOf(Permission)
    canPassPrivateProfiles: Permission;
    @objectOf(Permission)
    canRemoveUsersEssentials: Permission;
    @objectOf(Permission)
    canModerateVisitorMessages: Permission;
    @objectOf(Permission)
    canReadServerLogs: Permission;
    @objectOf(Permission)
    canManageSubscriptions: Permission;
    @objectOf(Permission)
    canViewStatistics: Permission;
    @objectOf(Permission)
    canEditUsersGroups: Permission;
    @objectOf(Permission)
    canManageThreadTemplates: Permission;

    constructor (source?: Partial<GroupSiteCpPermissions>) {
        ClassHelper.assign(this, source);
    }
}

export class GroupStaffPermissions {
    @objectOf(Permission)
    isStaff: Permission;
    @objectOf(Permission)
    canRadio: Permission;
    @objectOf(Permission)
    canEvent: Permission;
    @objectOf(Permission)
    canBookRadioForOthers: Permission;
    @objectOf(Permission)
    canBookEventForOthers: Permission;
    @objectOf(Permission)
    canManageEvents: Permission;
    @objectOf(Permission)
    canSeeIpsAndDeleteRequests: Permission;
    @objectOf(Permission)
    canKickDjOffAir: Permission;
    @objectOf(Permission)
    canManagePermShows: Permission;
    @objectOf(Permission)
    canOverrideDjSays: Permission;
    @objectOf(Permission)
    canSeeBookingLogs: Permission;
    @objectOf(Permission)
    canEditRadioInfo: Permission;
    @objectOf(Permission)
    canSeeDoNotHire: Permission;
    @objectOf(Permission)
    canManageBanOnSight: Permission;
    @objectOf(Permission)
    canSeeListeners: Permission;
    @objectOf(Permission)
    canAlwaysSeeConnectionInformation: Permission;
    @objectOf(Permission)
    canSeeEventStats: Permission;
    @objectOf(Permission)
    canManageAutoDJ: Permission;

    constructor (source?: Partial<GroupStaffPermissions>) {
        ClassHelper.assign(this, source);
    }
}

export class Group {
    @arrayOf(Group)
    groups: Array<Group> = [];
    @objectOf(GroupSiteCpPermissions)
    sitecpPermissions: GroupSiteCpPermissions;
    @objectOf(GroupStaffPermissions)
    staffPermissions: GroupStaffPermissions;
    @primitive()
    name: string;
    @primitive()
    nickname: string;
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
    nameColor: string;
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

    constructor (source?: Partial<Group>) {
        ClassHelper.assign(this, source);
    }
}

export enum GroupActions {
    BACK,
    SAVE,
    DELETE
}

