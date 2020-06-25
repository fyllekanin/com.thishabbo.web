import { arrayOf, ClassHelper, dateAndTime, objectOf, primitive } from 'shared/helpers/class.helper';
import { Badge } from '../badges.model';

export class BadgeUser {
    @primitive()
    nickname: string;
    @primitive()
    userId: number;
    @dateAndTime()
    createdAt: string;

    constructor (source: Partial<BadgeUser>) {
        ClassHelper.assign(this, source);
    }
}

export class BadgeUsersModel {
    @arrayOf(BadgeUser)
    users: Array<BadgeUser> = [];
    @arrayOf(BadgeUser)
    availableUsers: Array<BadgeUser> = [];
    @objectOf(Badge)
    badge: Badge;

    constructor (source: Partial<BadgeUsersModel>) {
        ClassHelper.assign(this, source);
    }
}
