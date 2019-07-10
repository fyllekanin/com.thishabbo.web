import { arrayOf, ClassHelper, objectOf, primitive, time } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class ForumLatestPost {
    @primitive()
    category: string;
    @primitive()
    page: number;
    @primitive()
    postId: number;
    @primitive()
    style: string;
    @primitive()
    text: string;
    @primitive()
    threadId: number;
    @primitive()
    title: string;
    @objectOf(SlimUser)
    user: SlimUser;
    @time()
    createdAt: string;
    @primitive()
    isRead: boolean;

    constructor (source: Partial<ForumLatestPost>) {
        ClassHelper.assign(this, source);
    }

    get time (): string {
        return this.createdAt;
    }
}


export class ForumPermissions {
    @primitive()
    canPost: boolean;
    @primitive()
    canRead: boolean;
    @primitive()
    canCreateThreads: boolean;
    @primitive()
    canEditOthersPosts: boolean;
    @primitive()
    canDeletePosts: boolean;
    @primitive()
    canStickyThread: boolean;
    @primitive()
    canCloseOpenThread: boolean;
    @primitive()
    canApproveThreads: boolean;
    @primitive()
    canApprovePosts: boolean;
    @primitive()
    canViewThreadContent: boolean;
    @primitive()
    canViewOthersThreads: boolean;
    @primitive()
    canManagePolls: boolean;
    @primitive()
    canChangeOwner: boolean;
    @primitive()
    canMergePosts: boolean;
    @primitive()
    canMoveThreads: boolean;
    @primitive()
    canOpenCloseOwnThread: boolean;
    @primitive()
    canPostInOthersThreads: boolean;

    constructor (source?: Partial<ForumPermissions>) {
        ClassHelper.assign(this, source);
    }
}

export class ThreadPrefix {
    @primitive()
    prefixId: number;
    @primitive()
    text: string;
    @primitive()
    style: string;

    constructor (source: Partial<ThreadPrefix>) {
        ClassHelper.assign(this, source);
    }
}

export class SlimPost {
    @primitive()
    postId: number;
    @primitive()
    threadId: number;
    @primitive()
    threadTitle: string;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    createdAt: number;
    @primitive()
    page: number;
    @objectOf(ThreadPrefix)
    prefix: ThreadPrefix;

    constructor (source: Partial<SlimPost>) {
        ClassHelper.assign(this, source);
    }
}

export class SlimThread {
    @primitive()
    threadId: number;
    @primitive()
    title: string;
    @primitive()
    isSticky: boolean;
    @primitive()
    isOpen: boolean;
    @primitive()
    nickname: string;
    @objectOf(SlimPost)
    lastPost: SlimPost;
    @primitive()
    userId: number;
    @primitive()
    posts: number;
    @primitive()
    views: number;
    @primitive()
    createdAt: number;
    @primitive()
    isApproved: boolean;
    @objectOf(ThreadPrefix)
    prefix: ThreadPrefix;
    @primitive()
    haveRead: boolean;
    @primitive()
    icon: string;
    @objectOf(SlimUser)
    user: SlimUser;

    constructor (source?: Partial<SlimThread>) {
        ClassHelper.assign(this, source);
    }
}

export class SlimCategory {
    @primitive()
    categoryId: number;
    @primitive()
    title: string;
    @primitive()
    link: string;
    @primitive()
    description: string;
    @primitive()
    posts: number;
    @primitive()
    threads: number;
    @objectOf(SlimPost)
    lastPost: SlimPost;
    @arrayOf(SlimCategory)
    childs: Array<SlimCategory> = [];
    @primitive()
    displayOrder: number;
    @primitive()
    icon: string;
    @primitive()
    haveRead: boolean;

    constructor (source?: Partial<SlimCategory>) {
        ClassHelper.assign(this, source);
    }
}

export enum AutoSave {
    POST,
    THREAD
}

export interface ForumAutoSave {
    type: AutoSave;
    contentId: number;
    content: string;
    title?: string;
    expiresAt?: number;
}
