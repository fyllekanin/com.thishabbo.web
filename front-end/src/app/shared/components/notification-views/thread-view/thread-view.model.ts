import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class ThreadViewThread {
    @primitive()
    threadId: number;
    @primitive()
    title: string;
    @primitive()
    page: number;
    @primitive()
    postId: number;

    constructor (source: Partial<ThreadView>) {
        ClassHelper.assign(this, source);
    }
}

export class ThreadView {
    @objectOf(SlimUser)
    user: SlimUser;
    @objectOf(ThreadViewThread)
    thread: ThreadViewThread;

    constructor (source: Partial<ThreadView>) {
        ClassHelper.assign(this, source);
    }
}
