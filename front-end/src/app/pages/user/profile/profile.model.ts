import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

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
    lastActivity: number;

    constructor(source: Partial<ProfileStats>) {
        ClassHelper.assign(this, source);
    }
}

export class ProfileModel {
    @objectOf(SlimUser)
    user: SlimUser;
    @objectOf(ProfileStats)
    stats: ProfileStats;

    constructor(source: Partial<ProfileModel>) {
        ClassHelper.assign(this, source);
    }
}
