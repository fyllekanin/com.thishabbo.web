import { SlimUser } from 'core/services/auth/auth.model';
import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export const LOG_TYPES = {
    SITECP: 'sitecp',
    MOD: 'mod',
    USER: 'user',
    STAFF: 'staff'
};

export class LogItem {
    @primitive()
    logId: number;
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    action: string;
    @primitive()
    createdAt: number;
    @objectOf(Object)
    data: object;
    @primitive()
    content: string;

    constructor (source: Partial<LogItem>) {
        ClassHelper.assign(this, source);
        if (!this.user) {
            this.user = new SlimUser({ nickname: 'Unknown' });
        }
    }
}

export class LogAction {
    @primitive()
    id: number;
    @primitive()
    description: string;

    constructor (source: Partial<LogAction>) {
        ClassHelper.assign(this, source);
    }
}

export class LogPage {
    @primitive()
    type: string;
    @primitive()
    total: number;
    @arrayOf(LogAction)
    actions: Array<LogAction> = [];
    @primitive()
    page: number;
    @arrayOf(LogItem)
    items: Array<LogItem> = [];

    constructor (source: Partial<LogPage>) {
        ClassHelper.assign(this, source);
    }
}
