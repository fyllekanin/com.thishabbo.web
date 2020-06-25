import { arrayOf, ClassHelper, objectOf, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { SlimUser, User } from 'core/services/auth/auth.model';

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
    likers: Array<SlimUser> = [];
    @primitive()
    isApproved: boolean;
    @primitiveOf(Boolean)
    isSelected = false;

    constructor (source?: Partial<PostModel>) {
        ClassHelper.assign(this, source);
        this.parsedContent = (this.parsedContent || '')
            .replace(new RegExp(/(([^\]>"=])https?:\/\/(www\.)?[a-zA-Z0-9]+\.[a-zA-Z]+[^\s\]<\[]+)/g), match => {
                return `<a href="${match.trim()}" target="_blank">${match}</a>`;
            });
    }
}

export enum PostActions {
    SAVE,
    BACK,
    AUTO_SAVE
}
