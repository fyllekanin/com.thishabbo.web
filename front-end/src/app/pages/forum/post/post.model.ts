import { ClassHelper, arrayOf, objectOf } from 'shared/helpers/class.helper';
import { primitive } from 'shared/helpers/class.helper';
import { User } from 'core/services/auth/auth.model';

export class PostModel {
    @primitive()
    postId: number;
    @primitive()
    threadId: number;
    @primitive()
    content: string;
    @primitive()
    parsedContent: string;
    @primitive()
    isDeleted: boolean;
    @objectOf(User)
    user: User;
    @primitive()
    createdAt: number;
    @primitive()
    updatedAt: number;
    @arrayOf(User)
    likers: Array<User> = [];
    @primitive()
    isApproved: boolean;
    @primitive()
    isSelected = false;

    constructor(source?: Partial<PostModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum PostActions {
    SAVE,
    CANCEL
}
