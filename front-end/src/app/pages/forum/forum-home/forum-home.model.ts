import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { ForumLatestPost } from '../forum.model';
import { SlimUser } from 'core/services/auth/auth.model';

export class ForumTopPoster {
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    posts: number;

    constructor(source: Partial<ForumTopPoster>) {
        ClassHelper.assign(this, source);
    }
}

export class ForumStats {
    @arrayOf(ForumLatestPost)
    latestPosts: Array<ForumLatestPost>;
    @arrayOf(ForumTopPoster)
    topPosters: Array<ForumTopPoster>;
    @arrayOf(ForumTopPoster)
    topPostersToday: Array<ForumTopPoster>;

    constructor(source?: Partial<ForumStats>) {
        ClassHelper.assign(this, source);
    }
}

export enum StatsActions {
    REFRESH,
    READ_ALL
}
