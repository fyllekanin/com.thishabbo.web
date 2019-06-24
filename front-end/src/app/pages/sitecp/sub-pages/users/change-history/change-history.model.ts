import { arrayOf, ClassHelper, objectOf, primitive, time } from 'shared/helpers/class.helper';
import { LOG_DICTIONARY } from 'shared/constants/log-dictionary.constants';
import { SlimUser } from 'core/services/auth/auth.model';

export class ChangeHistoryItem {
    @primitive()
    logId: number;
    @primitive()
    action: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    oldValue: string;
    @primitive()
    newValue: string;
    @time()
    createdAt: string;

    constructor (source: Partial<ChangeHistoryItem>) {
        ClassHelper.assign(this, source);
    }

    get type (): string {
        return LOG_DICTIONARY[this.action];
    }
}

export class ChangeHistoryPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @primitive()
    userId: number;
    @arrayOf(ChangeHistoryItem)
    items: Array<ChangeHistoryItem> = [];

    constructor (source: Partial<ChangeHistoryPage>) {
        ClassHelper.assign(this, source);
    }
}
