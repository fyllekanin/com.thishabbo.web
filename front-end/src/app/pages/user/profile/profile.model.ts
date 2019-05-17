import { arrayOf, ClassHelper, objectOf, primitive, time } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';
import { Activity } from 'core/services/continues-information/continues-information.model';
import { TimeHelper } from 'shared/helpers/time.helper';

export class ProfileStats {
    @primitive()
    posts: number;
    @primitive()
    threads: number;
    @primitive()
    likes: number;
    @time()
    createdAt: string;
    @primitive()
    userId: number;
    @time()
    lastActivity: string;

    constructor (source: Partial<ProfileStats>) {
        ClassHelper.assign(this, source);
    }
}

export class Followers {
    @arrayOf(SlimUser)
    followers: Array<SlimUser> = [];
    @primitive()
    total: number;
    @primitive()
    isFollowing: boolean;
    @primitive()
    isApproved: boolean;

    constructor (source: Partial<Followers>) {
        ClassHelper.assign(this, source);
    }
}

export class ProfileRelations {
    @objectOf(SlimUser)
    love: SlimUser;
    @objectOf(SlimUser)
    like: SlimUser;
    @objectOf(SlimUser)
    hate: SlimUser;

    constructor (source: Partial<ProfileRelations>) {
        ClassHelper.assign(this, source);
    }
}

export class ProfileVisitorMessage {
    @primitive()
    visitorMessageId: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    content: string;
    @primitive()
    replies: number;
    @primitive()
    likes: number;
    @primitive()
    isLiking: boolean;
    @arrayOf(ProfileVisitorMessage)
    comments: Array<ProfileVisitorMessage> = [];
    @primitive()
    createdAt: number;

    constructor (source: Partial<ProfileVisitorMessage>) {
        ClassHelper.assign(this, source);
    }
}

export class ProfileVisitorMessages {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(ProfileVisitorMessage)
    items: Array<ProfileVisitorMessage> = [];

    constructor (source: Partial<ProfileVisitorMessages>) {
        ClassHelper.assign(this, source);
    }
}

export class ProfileAccolade {
    @primitive()
    icon: string;
    @primitive()
    role: string;
    @primitive()
    color: string;
    @primitive()
    start: number;
    @primitive()
    end: number;

    constructor (source: Partial<ProfileAccolade>) {
        ClassHelper.assign(this, source);
    }

    getStartLabel (): string {
        const date = new Date(this.start * 1000);
        return `${TimeHelper.FULL_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }

    getEndLabel (): string {
        if (!this.end) {
            return 'Present';
        }
        const date = new Date(this.end * 1000);
        return `${TimeHelper.FULL_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }
}

export class ProfileModel {
    @objectOf(SlimUser)
    user: SlimUser;
    @arrayOf(Activity)
    activities: Array<Activity> = [];
    @objectOf(ProfileStats)
    stats: ProfileStats;
    @primitive()
    youtube: string;
    @objectOf(Followers)
    followers: Followers;
    @objectOf(ProfileRelations)
    relations: ProfileRelations;
    @objectOf(ProfileVisitorMessages)
    visitorMessages: ProfileVisitorMessages;
    @arrayOf(ProfileAccolade)
    accolades: Array<ProfileAccolade> = [];


    constructor (source: Partial<ProfileModel>) {
        ClassHelper.assign(this, source);
        this.youtube = this.youtube ? this.youtube.replace('watch?v=', 'embed/') : null;
    }
}

export enum ProfileActions {
    FOLLOW,
    UNFOLLOW
}
