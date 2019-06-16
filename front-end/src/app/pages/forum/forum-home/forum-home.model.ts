import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { ForumLatestPost } from '../forum.model';
import { arrayOf } from 'shared/helpers/class.helper';
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
    @arrayOf(SlimUser)
    currentlyActive: Array<SlimUser> = [];
    @arrayOf(SlimUser)
    activeToday: Array<SlimUser> = [];

    constructor(source?: Partial<ForumStats>) {
        ClassHelper.assign(this, source);
    }
}
