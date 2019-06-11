import { arrayOf, ClassHelper, objectOf, primitive, time } from 'shared/helpers/class.helper';
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
    @time()
    createdAt: string;
    @objectOf(Prefix)
    prefix: Prefix;

    constructor (source?: Partial<SlimArticle>) {
        ClassHelper.assign(this, source);
    }
}
