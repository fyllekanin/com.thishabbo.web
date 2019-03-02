import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class ProfileStats {
    @primitive()
    posts: number;
    @primitive()
    threads: number;
    @primitive()
    likes: number;
    @primitive()
    createdAt: number;
    @primitive()
    userId: number;
    @primitive()
    habbo: string;
    @primitive()
    lastActivity: number;

    constructor(source: Partial<ProfileStats>) {
        ClassHelper.assign(this, source);
    }
}

export class ProfileModel {
    @primitive()
    userId: number;
    @primitive()
    nickname: string;
    @primitive()
    avatarUpdatedAt: number;
    @objectOf(ProfileStats)
    stats: ProfileStats;

    constructor(source: Partial<ProfileModel>) {
        ClassHelper.assign(this, source);
    }
}
