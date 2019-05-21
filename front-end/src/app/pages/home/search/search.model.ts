import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export enum SearchTypes {
    THREADS = 'threads',
    POSTS = 'posts',
    USER = 'users'
}

export class SearchParameters {
    @primitive()
    type: string;
    @primitive()
    text: string;
    @primitive()
    byUser: string;
    @objectOf(Date)
    from: Date;
    @objectOf(Date)
    to: Date;
    @primitive()
    order: string;

    constructor (source: Partial<SearchParameters>) {
        ClassHelper.assign(this, source);
    }
}

export class SearchResult {
    @primitive()
    id: number;
    @primitive()
    parentId: number;
    @primitive()
    page: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    title: string;
    @primitive()
    createdAt: number;

    constructor (source: Partial<SearchResult>) {
        ClassHelper.assign(this, source);
    }
}

export class SearchPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(SearchResult)
    items: Array<SearchResult> = [];
    @objectOf(SearchParameters)
    parameters: SearchParameters;

    constructor (source: Partial<SearchPage>) {
        ClassHelper.assign(this, source);
    }
}
