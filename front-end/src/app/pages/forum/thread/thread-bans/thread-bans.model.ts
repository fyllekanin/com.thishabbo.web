import { ClassHelper, objectOf, primitive, time } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class ThreadBan {
    @primitive()
    threadBanId: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @objectOf(SlimUser)
    bannedBy: SlimUser;
    @time()
    bannedAt: string;

    constructor (source: Partial<ThreadBan>) {
        ClassHelper.assign(this, source);
    }
}