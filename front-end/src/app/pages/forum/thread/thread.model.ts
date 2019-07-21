import { ForumPermissions, ThreadPrefix } from '../forum.model';
import { CategoryParent } from '../category/category.model';
import { arrayOf, ClassHelper, objectOf, primitive, time } from 'shared/helpers/class.helper';
import { PostModel } from '../post/post.model';
import { SlimUser, User } from 'core/services/auth/auth.model';
import { ThreadPoll } from './thread-poll/thread-poll.model';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';
import { StringHelper } from 'shared/helpers/string.helper';
import { CategoryTemplates } from 'shared/constants/templates.constants';

export class ThreadReader {
    @objectOf(SlimUser)
    user: SlimUser;
    @time()
    time: string;
    @primitive()
    currentlyViewing: boolean;

    constructor (source: Partial<ThreadReader>) {
        ClassHelper.assign(this, source);
    }

    get timeAgo (): string {
        return this.time;
    }
}


export class ThreadPage {
    @primitive()
    threadId: number;
    @primitive()
    firstPostId: number;
    @primitive()
    title: string;
    @primitive()
    createdAt: number;
    @objectOf(User)
    user: User = new User();
    @arrayOf(PostModel)
    threadPosts: Array<PostModel> = [];
    @primitive()
    isOpen: boolean;
    @arrayOf(CategoryParent)
    parents: Array<CategoryParent> = [];
    @objectOf(ForumPermissions)
    forumPermissions: ForumPermissions = new ForumPermissions();
    @primitive()
    categoryId: number;
    @primitive()
    page: number;
    @primitive()
    total: number;
    @primitive()
    isApproved: boolean;
    @primitive()
    isSticky: boolean;
    @primitive()
    contentApproval: boolean;
    @objectOf(ThreadPrefix)
    prefix: ThreadPrefix;
    @primitive()
    categoryIsOpen: boolean;
    @primitive()
    isSubscribed: boolean;
    @objectOf(ThreadPoll)
    poll: ThreadPoll;
    @primitive()
    isIgnored: boolean;
    @arrayOf(ThreadReader)
    readers: Array<ThreadReader> = [];
    @arrayOf(ThreadReader)
    currentReaders: Array<ThreadReader> = [];
    @primitive()
    template: string;
    @primitive()
    badge: string;
    @arrayOf(String)
    tags: Array<string> = [];
    @primitive()
    roomLink: string;

    constructor (source?: Partial<ThreadPage>) {
        ClassHelper.assign(this, source);
        if (!this.user) {
            this.user = new User();
        }
    }
}

export enum ThreadActions {
    DELETE_THREAD,
    APPROVE_POSTS,
    UNAPPROVE_POSTS,
    EDIT_THREAD,
    UNAPPROVE_THREAD,
    APPROVE_THREAD,
    UNSTICKY_THREAD,
    STICKY_THREAD,
    POST,
    POST_CLOSE,
    POST_OPEN,
    AUTO_SAVE,
    DELETE_POLL,
    VIEW_POLL,
    CLOSE_THREAD,
    OPEN_THREAD,
    CHANGE_THREAD_OWNER,
    MERGE_POSTS,
    MOVE_THREAD,
    MERGE_THREAD,
    SUBSCRIBE,
    UNSUBSCRIBE,
    IGNORE,
    UNIGNORE,
    THREAD_HISTORY,
    POST_HISTORY,
    TOGGLE_TOOLS,
    THREAD_POSTERS,
    CHANGE_POST_OWNER,
    SELECT_ALL,
    DELETE_POSTS
}

export class PostHistoryModel {
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    before: string;
    @primitive()
    after: string;
    @primitive()
    createdAt: number;

    constructor (source: Partial<PostHistoryModel>) {
        ClassHelper.assign(this, source);
    }
}

export function getStatsBoxes (thread: ThreadPage): Array<StatsBoxModel> {
    if (thread.template !== CategoryTemplates.QUEST) {
        return [];
    }
    const items = [
        {
            borderColor: TitleTopBorder.GREEN,
            externalIcon: `https://habboo-a.akamaihd.net/c_images/album1584/${thread.badge}.gif`,
            title: 'Badge',
            breadText: 'The badge earned from this guide',
            condition: thread.badge
        },
        {
            borderColor: TitleTopBorder.RED,
            icon: 'fas fa-tags',
            title: 'Tags',
            innerHTML: thread.tags.reduce((prev, curr) => {
                return prev + `<span class="tag ${curr}">${StringHelper.prettifyString(curr)}</span>`;
            }, ''),
            condition: true
        },
        {
            borderColor: TitleTopBorder.BLUE,
            externalIcon: '/assets/images/room.gif',
            externalIconStyle: thread.roomLink ? '' : '-webkit-filter: grayscale(100%); filter: grayscale(100%);',
            externalIconLink: thread.roomLink,
            title: 'Room Link',
            breadText: thread.roomLink ? 'Click above to open the hotel' : 'There is no link for this',
            condition: true
        }
    ];
    return items.filter(item => item.condition).map(item => new StatsBoxModel(item));
}

export function getPostTools (forumPermissions: ForumPermissions) {
    return [
        {title: 'Approve Posts', value: ThreadActions.APPROVE_POSTS, condition: forumPermissions.canApprovePosts},
        {title: 'Unapprove Posts', value: ThreadActions.UNAPPROVE_POSTS, condition: forumPermissions.canApprovePosts},
        {title: 'Merge Posts', value: ThreadActions.MERGE_POSTS, condition: forumPermissions.canMergeThreadsAndPosts},
        {title: 'Change Owner', value: ThreadActions.CHANGE_POST_OWNER, condition: forumPermissions.canChangeOwner},
        {title: 'Edit History', value: ThreadActions.POST_HISTORY, condition: forumPermissions.canEditOthersPosts},
        {title: 'Delete Posts', value: ThreadActions.DELETE_POSTS, condition: forumPermissions.canDeletePosts}
    ];
}

/**
 * Get the list of thread actions that can be used
 * @param userId of the logged in user
 * @param threadPage of the current thread
 * @param forumPermissions of the current user
 */
export function getThreadTools (userId: number, threadPage: ThreadPage, forumPermissions: ForumPermissions) {
    return [
        {
            title: 'Edit Thread',
            value: ThreadActions.EDIT_THREAD,
            condition: forumPermissions.canEditOthersPosts || userId === threadPage.user.userId
        },
        {
            title: 'Delete Thread',
            value: ThreadActions.DELETE_THREAD,
            condition: forumPermissions.canDeletePosts
        },
        {
            title: 'Approve',
            value: ThreadActions.APPROVE_THREAD,
            condition: forumPermissions.canApproveThreads && !threadPage.isApproved
        },
        {
            title: 'Unapprove',
            value: ThreadActions.UNAPPROVE_THREAD,
            condition: forumPermissions.canApproveThreads && threadPage.isApproved
        },
        {
            title: 'Sticky',
            value: ThreadActions.STICKY_THREAD,
            condition: forumPermissions.canStickyThread && !threadPage.isSticky
        },
        {
            title: 'Unsticky',
            value: ThreadActions.UNSTICKY_THREAD,
            condition: forumPermissions.canStickyThread && threadPage.isSticky
        },
        {
            title: 'Delete Poll',
            value: ThreadActions.DELETE_POLL,
            condition: threadPage.poll && forumPermissions.canManagePolls
        },
        {
            title: 'View Poll',
            value: ThreadActions.VIEW_POLL,
            condition: threadPage.poll && forumPermissions.canManagePolls
        },
        {
            title: 'Close Thread',
            value: ThreadActions.CLOSE_THREAD,
            condition: (forumPermissions.canCloseOpenThread || (
                forumPermissions.canOpenCloseOwnThread && threadPage.user.userId === userId
            )) && threadPage.isOpen
        },
        {
            title: 'Open Thread',
            value: ThreadActions.OPEN_THREAD,
            condition: (forumPermissions.canCloseOpenThread || (
                forumPermissions.canOpenCloseOwnThread && threadPage.user.userId === userId
            )) && !threadPage.isOpen
        },
        {
            title: 'Change Owner',
            value: ThreadActions.CHANGE_THREAD_OWNER,
            condition: forumPermissions.canChangeOwner
        },
        {
            title: 'Move Thread',
            value: ThreadActions.MOVE_THREAD,
            condition: forumPermissions.canMoveThreads
        },
        {
            title: 'Merge Thread',
            value: ThreadActions.MERGE_THREAD,
            condition: forumPermissions.canMergeThreadsAndPosts
        },
        {
            title: 'Edit History',
            value: ThreadActions.THREAD_HISTORY,
            condition: forumPermissions.canEditOthersPosts
        }
    ];
}
