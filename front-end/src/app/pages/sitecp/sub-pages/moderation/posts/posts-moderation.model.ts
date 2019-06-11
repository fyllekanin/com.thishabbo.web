import { User } from 'core/services/auth/auth.model';
import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class PostModerate {
    @primitive()
    postId: number;
    @primitive()
    threadId: number;
    @primitive()
    threadTitle: string;
    @objectOf(User)
    user: User;
    @primitive()
    canApprove: boolean;
    @primitive()
    canDelete: boolean;
    @primitive()
    content: string;

    constructor(source: Partial<PostModerate>) {
        ClassHelper.assign(this, source);
    }
}

export enum PostModerationActions {
    APPROVE_POST,
    DELETE_POST,
    WATCH_CONTENT
}
