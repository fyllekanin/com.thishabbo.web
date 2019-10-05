import { arrayOf, ClassHelper, date, objectOf, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { UserHelper } from 'shared/helpers/user.helper';
import { TabModel } from 'shared/app-views/header/tabs/tabs.model';

export class UserCustomFields {
    @primitive()
    role: string;

    constructor (source: Partial<UserCustomFields>) {
        ClassHelper.assign(this, source);
    }
}

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

export class SlimUser {
    @primitive()
    userId: number;
    @primitive()
    nickname: string;
    @primitive()
    habbo: string;
    @arrayOf(String)
    nameColor: Array<string> = [];
    @primitive()
    namePosition: number;
    @primitive()
    iconId: number;
    @primitive()
    iconPosition: string;
    @primitive()
    effectId: number;
    @primitive()
    avatarUpdatedAt: number;
    @primitive()
    posts: number;
    @primitive()
    likes: number;
    @date()
    createdAt: number;

    avatarUrl: string;
    coverUrl: string;
    iconUrl: string;
    effectUrl: string;
    nameStyling: string;

    constructor (source?: Partial<SlimUser>) {
        ClassHelper.assign(this, source);

        this.avatarUrl = `url('/rest/resources/images/users/${this.userId}.gif?${this.avatarUpdatedAt}')`;
        this.coverUrl = `url('/rest/resources/images/covers/${this.userId}.gif?${this.avatarUpdatedAt}')`;
        this.iconUrl = this.iconId ? `/rest/resources/images/shop/${this.iconId}.gif` : null;
        this.iconPosition = this.iconPosition || 'left';
        this.effectUrl = this.effectId ? `url(/rest/resources/images/shop/${this.effectId}.gif)` : '';
        this.nameStyling = UserHelper.getNameColor(this.nameColor);
    }
}

export class UserPostBitSettings {
    @primitive()
    hideJoinDate: boolean;
    @primitive()
    hidePostCount: boolean;
    @primitive()
    hideLikesCount: boolean;
    @primitive()
    hideHabbo: boolean;

    constructor (source?: Partial<UserPostBitSettings>) {
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
    @objectOf(UserSocial)
    social: UserSocial;
    @primitive()
    namePosition: number;
    @arrayOf(String)
    barColor: Array<string> = [];
    @arrayOf(Number)
    badgeIds: Array<number> = [];
    @objectOf(UserPostBitSettings)
    postBitSettings: UserPostBitSettings = new UserPostBitSettings();

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
    canSeeIpsAndDeleteRequests: boolean;
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
    canAlwaysSeeConnectionInformation: boolean;
    @primitive()
    canSeeEventStats: boolean;

    constructor (source?: Partial<StaffPermissions>) {
        ClassHelper.assign(this, source);
    }
}

export class SitecpPermissions {
    @primitive()
    isSitecp: boolean;
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
    @primitive()
    canViewStatistics: boolean;
    @primitive()
    canEditUsersGroups: boolean;

    constructor (source?: Partial<SitecpPermissions>) {
        ClassHelper.assign(this, source);
    }
}

export class AuthUser {
    @primitive()
    userId: number;
    @primitive()
    nickname: string;
    @objectOf(SitecpPermissions)
    sitecpPermissions: SitecpPermissions = new SitecpPermissions();
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
    @primitiveOf(Number)
    xp = 0;
    @arrayOf(TabModel)
    tabs: Array<TabModel> = [];

    constructor (source: Partial<AuthUser>) {
        ClassHelper.assign(this, source);
    }

    get isSitecp (): boolean {
        return this.sitecpPermissions && this.sitecpPermissions.isSitecp;
    }

    get isStaff (): boolean {
        return this.staffPermissions && this.staffPermissions.isStaff;
    }
}
