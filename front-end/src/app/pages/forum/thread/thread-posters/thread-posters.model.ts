import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class ThreadPoster {
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    posts: number;

    constructor (source: Partial<ThreadPoster>) {
        ClassHelper.assign(this, source);
    }
}

export class ThreadPostersModel {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(ThreadPoster)
    items: Array<ThreadPoster> = [];

    constructor (source: Partial<ThreadPostersModel>) {
        ClassHelper.assign(this, source);
    }
}
