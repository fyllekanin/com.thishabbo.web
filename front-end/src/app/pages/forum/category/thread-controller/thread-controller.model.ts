import { ThreadPrefix } from '../../forum.model';
import { CategoryParent } from '../category.model';
import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { ThreadPoll } from '../../thread/thread-poll/thread-poll.model';

export class SlimThreadTemplate {
    @primitive()
    name: string;
    @primitive()
    content: string;

    constructor (source?: Partial<SlimThreadTemplate>) {
        ClassHelper.assign(this, source);
    }
}

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
    @arrayOf(SlimThreadTemplate)
    threadTemplates: Array<SlimThreadTemplate> = [];
    @arrayOf(ThreadPrefix)
    prefixes: Array<ThreadPrefix> = [];
    @primitive()
    prefixId: number;
    @arrayOf(String)
    tags: Array<string> = [];
    @arrayOf(String)
    badges: Array<string> = [];
    @primitive()
    roomLink: string;
    @objectOf(ThreadPoll)
    poll: ThreadPoll;
    @primitive()
    canHavePoll: boolean;

    constructor (source?: Partial<ThreadSkeleton>) {
        ClassHelper.assign(this, source);
    }
}

export enum ThreadControllerActions {
    SAVE,
    BACK,
    AUTO_SAVE,
    TOGGLE_POLL
}
