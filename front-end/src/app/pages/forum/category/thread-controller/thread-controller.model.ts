import { ThreadPrefix } from '../../forum.model';
import { CategoryParent } from '../category.model';
import { primitive, arrayOf, ClassHelper, objectOf } from 'shared/helpers/class.helper';
import { ThreadPoll } from '../../thread/thread-poll/thread-poll.model';

export class ThreadSkeleton {
    @primitive()
    threadId: number;
    @primitive()
    categoryId: number;
    @arrayOf(CategoryParent)
    parents: Array<CategoryParent> = [];
    @primitive()
    title: string;
    @primitive()
    content: string;
    @primitive()
    createdAt: number;
    @primitive()
    template: string;
    @primitive()
    contentApproval: boolean;
    @arrayOf(ThreadPrefix)
    prefixes: Array<ThreadPrefix> = [];
    @primitive()
    prefixId: number;
    @arrayOf(String)
    tags: Array<string> = [];
    @primitive()
    badge: string;
    @objectOf(ThreadPoll)
    poll: ThreadPoll;

    constructor(source?: Partial<ThreadSkeleton>) {
        ClassHelper.assign(this, source);
    }
}

export enum ThreadControllerActions {
    SAVE,
    CANCEL,
    AUTO_SAVE,
    TOGGLE_POLL
}
