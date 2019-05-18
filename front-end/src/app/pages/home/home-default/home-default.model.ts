import { Notice } from 'shared/components/notice/notice.model';
import { arrayOf, ClassHelper, objectOf, primitive, time } from 'shared/helpers/class.helper';
import { SlimArticle } from 'shared/components/slim-article/slim-article.model';
import { SlimUser } from 'core/services/auth/auth.model';
import { ThreadPrefix } from '../../forum/forum.model';

export class HomePageThread {
    @primitive()
    threadId: number;
    @primitive()
    title: string;
    @objectOf(SlimUser)
    user: SlimUser;
    @objectOf(ThreadPrefix)
    prefix: ThreadPrefix;
    @time()
    createdAt: string;

    constructor (source: Partial<HomePageThread>) {
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

    constructor (source?: Partial<HomeDefaultPage>) {
        ClassHelper.assign(this, source);
    }
}
