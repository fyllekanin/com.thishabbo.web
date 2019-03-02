import { SlimUser } from 'core/services/auth/auth.model';
import { Notice } from 'shared/components/notice/notice.model';
import { ClassHelper, primitive, arrayOf, objectOf } from 'shared/helpers/class.helper';
import { Prefix } from '../../admin/sub-pages/forum/prefixes/prefix.model';

export enum ARTICLE_TAG {
    AVAILABLE = 'AVAILABLE',
    EASY = 'EASY',
    FREE = 'FREE',
    CLOSED = 'CLOSED'
}

export class SlimArticle {
    @primitive()
    threadId: number;
    @primitive()
    badge: string;
    @primitive()
    title: string;
    @primitive()
    content: string;
    @arrayOf(String)
    tags: Array<string> = [];
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    createdAt: number;
    @objectOf(Prefix)
    prefix: Prefix;

    constructor(source?: Partial<SlimArticle>) {
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

    constructor(source?: Partial<HomeDefaultPage>) {
        ClassHelper.assign(this, source);
    }
}
