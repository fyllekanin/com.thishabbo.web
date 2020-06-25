import { arrayOf, ClassHelper, dateAndTime, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';
import { Prefix } from '../../../pages/sitecp/sub-pages/forum/prefixes/prefix.model';

export enum ARTICLE_TAG {
    AVAILABLE = 'AVAILABLE',
    EASY = 'EASY',
    FREE = 'FREE',
    CLOSED = 'CLOSED',
    DIFFICULT = 'DIFFICULT'
}

export class SlimArticle {
    @primitive()
    threadId: number;
    @arrayOf(String)
    badges: Array<string>;
    @primitive()
    title: string;
    @primitive()
    content: string;
    @arrayOf(String)
    tags: Array<string> = [];
    @objectOf(SlimUser)
    user: SlimUser;
    @dateAndTime()
    createdAt: string;
    @primitive()
    updatedAt: number;
    @objectOf(Prefix)
    prefix: Prefix;

    backgroundUrl: string;

    get avatarUrl (): string {
        return `/resources/images/users/${this.user.userId}.gif?${this.user.avatarUpdatedAt}`;
    }

    constructor (source?: Partial<SlimArticle>) {
        ClassHelper.assign(this, source);
        this.backgroundUrl = `url(/resources/images/thumbnails/${this.threadId}.gif?updatedAt=${this.updatedAt})`;
    }
}
