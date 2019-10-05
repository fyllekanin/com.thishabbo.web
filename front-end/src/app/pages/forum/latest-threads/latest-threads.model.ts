import { arrayOf, ClassHelper, dateAndTime, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class LatestThread {
    @primitive()
    categoryId: number;
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
    @dateAndTime()
    createdAt: string;
    @primitive()
    isRead: boolean;

    constructor (source: Partial<LatestThread>) {
        ClassHelper.assign(this, source);
    }

    get time (): string {
        return this.createdAt;
    }
}

export class LatestThreadsPage {
    @primitive()
    page: number;
    @primitive()
    total: number;
    @arrayOf(LatestThread)
    items: Array<LatestThread> = [];

    constructor (source: Partial<LatestThreadsPage>) {
        ClassHelper.assign(this, source);
    }
}
