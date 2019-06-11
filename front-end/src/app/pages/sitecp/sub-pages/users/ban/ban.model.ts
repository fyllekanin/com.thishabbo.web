import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class Ban {
    @primitive()
    banId: number;
    @objectOf(SlimUser)
    banner: SlimUser;
    @objectOf(SlimUser)
    banned: SlimUser;
    @primitive()
    reason: string;
    @primitive()
    expiresAt: number;
    @primitive()
    isLifted: boolean;
    @objectOf(SlimUser)
    lifter: SlimUser;
    @primitive()
    liftReason: string;
    @primitive()
    updatedAt: number;

    constructor(source: Partial<Ban>) {
        ClassHelper.assign(this, source);
    }
}

export class BanModel {
    @objectOf(SlimUser)
    user: SlimUser;
    @arrayOf(Ban)
    bans: Array<Ban> = [];

    constructor(source?: Partial<BanModel>) {
        ClassHelper.assign(this, source);
    }
}
