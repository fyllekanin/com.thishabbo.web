import { Notice } from 'shared/components/notice/notice.model';
import { arrayOf, ClassHelper, objectOf, primitive, dateAndTime } from 'shared/helpers/class.helper';
import { SlimArticle } from 'shared/components/slim-article/slim-article.model';
import { SlimUser } from 'core/services/auth/auth.model';
import { ThreadPrefix } from '../../forum/forum.model';
import { BadgeModel } from 'shared/components/badges/badges.model';

export class HomePageThread {
    @primitive()
    threadId: number;
    @primitive()
    title: string;
    @objectOf(SlimUser)
    user: SlimUser;
    @objectOf(ThreadPrefix)
    prefix: ThreadPrefix;
    @dateAndTime()
    createdAt: string;

    constructor (source: Partial<HomePageThread>) {
        ClassHelper.assign(this, source);
    }
}

export class StaffSpotlightUser {
    @primitive()
    nickname: string;
    @primitive()
    habbo: string;
    @primitive()
    role: string;

    constructor (source: Partial<StaffSpotlightUser>) {
        ClassHelper.assign(this, source);
    }
}

export class HomeDefaultPage {
    @arrayOf(SlimArticle)
    articles: Array<SlimArticle> = [];
    @arrayOf(SlimArticle)
    mediaArticles: Array<SlimArticle> = [];
    @arrayOf(Notice)
    notices: Array<Notice> = [];
    @arrayOf(HomePageThread)
    threads: Array<HomePageThread> = [];
    @arrayOf(StaffSpotlightUser)
    spotlight: Array<StaffSpotlightUser> = [];
    @arrayOf(BadgeModel)
    badges: Array<BadgeModel> = [];

    constructor (source?: Partial<HomeDefaultPage>) {
        ClassHelper.assign(this, source);
    }
}
