import { User } from 'core/services/auth/auth.model';
import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class ThreadModerate {
    @primitive()
    threadId: number;
    @primitive()
    title: string;
    @primitive()
    categoryId: number;
    @primitive()
    categoryTitle: string;
    @objectOf(User)
    user: User;
    @primitive()
    canApprove: boolean;
    @primitive()
    canDelete: boolean;

    constructor (source: Partial<ThreadModerate>) {
        ClassHelper.assign(this, source);
    }
}

export enum ThreadModerationActions {
    APPROVE_THREAD,
    DELETE_THREAD
}
