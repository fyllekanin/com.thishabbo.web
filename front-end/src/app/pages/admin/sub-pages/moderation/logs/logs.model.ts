import { SlimUser } from 'core/services/auth/auth.model';
import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export const LOG_TYPES = {
    ADMIN: 'admin',
    MOD: 'mod',
    USER: 'user',
    STAFF: 'staff'
};

export class LogItem {
    @objectOf(SlimUser)
    user: SlimUser;
    @primitive()
    action: string;
    @primitive()
    createdAt: number;
    @objectOf(Object)
    data: object;

    constructor(source: Partial<LogItem>) {
        ClassHelper.assign(this, source);
    }
}

export class LogPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(LogItem)
    items: Array<LogItem> = [];

    constructor(source: Partial<LogPage>) {
        ClassHelper.assign(this, source);
    }
}
