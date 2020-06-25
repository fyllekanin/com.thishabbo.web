import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class Follower {
    @primitive()
    followerId: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    createdAt: number;

    constructor (source: Partial<Follower>) {
        ClassHelper.assign(this, source);
    }
}

export class FollowersPage {
    @arrayOf(Follower)
    awaiting: Array<Follower> = [];
    @arrayOf(Follower)
    followers: Array<Follower> = [];
    @primitive()
    total: number;
    @primitive()
    page: number;

    constructor (source: Partial<FollowersPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum FollowersAction {
    APPROVE,
    DENY,
    REMOVE
}
