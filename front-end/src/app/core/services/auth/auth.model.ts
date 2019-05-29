import { arrayOf, ClassHelper, objectOf, primitive, primitiveOf } from 'shared/helpers/class.helper';

export class DisplayGroup {
    @primitive()
    groupId: number;
    @primitive()
    nameStyling: string;

    constructor (source: Partial<DisplayGroup>) {
        ClassHelper.assign(this, source);
    }
}

export class UserBar {
    @primitive()
    name: string;
    @primitive()
    styling: string;

    constructor (source: Partial<UserBar>) {
        ClassHelper.assign(this, source);
    }
}

export class UserSocial {
    @primitive()
    discord: string;
    @primitive()
    twitter: string;

    constructor (source: Partial<UserSocial>) {
        ClassHelper.assign(this, source);
    }
}

export class UserBadge {
    @primitive()
    badgeId: number;
    @primitive()
    name: string;
    @primitive()
    description: string;
    @primitive()
    updatedAt: number;

    constructor (source: Partial<UserBadge>) {
        ClassHelper.assign(this, source);
    }
}

export class SlimUser {
    @primitive()
    userId: number;
    @primitive()
    nickname: string;
    @arrayOf(String)
    nameColour: Array<string> = [];
    @primitive()
    avatarUpdatedAt: number;
    @primitive()
    createdAt: number;

    constructor (source?: Partial<SlimUser>) {
        ClassHelper.assign(this, source);
    }
}

export class User extends SlimUser {
    @arrayOf(UserBar)
    userBars: Array<UserBar> = [];
    @primitive()
    signature: string;
    @primitive()
    avatarUpdatedAt: number;
    @objectOf(DisplayGroup)
    displayGroup: DisplayGroup;
    @primitive()
    posts: number;
    @primitive()
    likes: number;
    @objectOf(UserSocial)
    social: UserSocial;
    @arrayOf(UserBadge)
    badges: Array<UserBadge> = [];

    constructor (source?: Partial<User>) {
        super(source);
        ClassHelper.assign(this, source);
    }
}

export class OAuth {
    @primitive()
    accessToken: string;
    @primitive()
    expiresIn: number;
    @primitive()
    refreshToken: string;

    constructor (source: Partial<OAuth>) {
        ClassHelper.assign(this, source);
    }
}

export class StaffPermissions {
    @primitive()
    isStaff: boolean;
    @primitive()
    canRadio: boolean;
    @primitive()
    canEvent: boolean;
    @primitive()
    canBookRadioForOthers: boolean;
    @primitive()
    canBookEventForOthers: boolean;
    @primitive()
    canManageEvents: boolean;
    @primitive()
    canSeeIpOnRequests: boolean;
    @primitive()
    canKickDjOffAir: boolean;
    @primitive()
    canManagePermShows: boolean;
    @primitive()
    canOverrideDjSays: boolean;
    @primitive()
    canSeeBookingLogs: boolean;
    @primitive()
    canEditRadioInfo: boolean;
    @primitive()
    canSeeDoNotHire: boolean;
    @primitive()
    canManageBanOnSight: boolean;
    @primitive()
    canSeeListeners: boolean;
    @primitive()
    canSetEventsText: boolean;

    constructor (source?: Partial<StaffPermissions>) {
        ClassHelper.assign(this, source);
    }
}

export class AdminPermissions {
    @primitive()
    isAdmin: boolean;
    @primitive()
    canManageForum: boolean;
    @primitive()
    canManageForumPermissions: boolean;
    @primitive()
    canManageGroups: boolean;
    @primitive()
    canEditWebsiteSettings: boolean;
    @primitive()
    canModerateThreads: boolean;
    @primitive()
    canModeratePosts: boolean;
    @primitive()
    canApprovePublicGroups: boolean;
    @primitive()
    canManageBBcodes: boolean;
    @primitive()
    canManagePrefixes: boolean;
    @primitive()
    canManageGroupsList: boolean;
    @primitive()
    canEditUserBasic: boolean;
    @primitive()
    canEditUserAdvanced: boolean;
    @primitive()
    canBanUser: boolean;
    @primitive()
    canMergeUsers: boolean;
    @primitive()
    canManageBadges: boolean;
    @primitive()
    canManageBetting: boolean;
    @primitive()
    canManageTHC: boolean;
    @primitive()
    canManagePolls: boolean;
    @primitive()
    canSeeIps: boolean;
    @primitive()
    canManageInfractions: boolean;
    @primitive()
    canDoInfractions: boolean;
    @primitive()
    canSeeLogs: boolean;
    @primitive()
    canManageShop: boolean;
    @primitive()
    canPassPrivate: boolean;
    @primitive()
    canRemoveEssentials: boolean;
    @primitive()
    canModerateVisitorMessage: boolean;
    @primitive()
    canReadServerLogs: boolean;
    @primitive()
    canManageSubscriptions: boolean;

    constructor (source?: Partial<AdminPermissions>) {
        ClassHelper.assign(this, source);
    }
}

export class AuthUser {
    @primitive()
    userId: number;
    @primitive()
    nickname: string;
    @objectOf(AdminPermissions)
    adminPermissions: AdminPermissions = new AdminPermissions();
    @objectOf(StaffPermissions)
    staffPermissions: StaffPermissions = new StaffPermissions();
    @objectOf(OAuth)
    oauth: OAuth;
    @primitive()
    avatarUpdatedAt: number;
    @primitive()
    gdpr: boolean;
    @primitive()
    homePage: string;
    @primitiveOf(Number)
    credits = 0;

    constructor (source: Partial<AuthUser>) {
        ClassHelper.assign(this, source);
    }

    get isAdmin (): boolean {
        return this.adminPermissions && this.adminPermissions.isAdmin;
    }

    get isStaff (): boolean {
        return this.staffPermissions && this.staffPermissions.isStaff;
    }
}
