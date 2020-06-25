import { arrayOf, ClassHelper, dateAndTime, primitive } from 'shared/helpers/class.helper';

export class ThcRequestLog {
    @primitive()
    nickname: string;
    @primitive()
    habbo: string;
    @primitive()
    amount: number;
    @primitive()
    isPending: boolean;
    @primitive()
    isApproved: boolean;
    @dateAndTime()
    updatedAt: string;

    constructor (source: Partial<ThcRequestLog>) {
        ClassHelper.assign(this, source);
    }
}

export class ThcRequestLogPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(ThcRequestLog)
    items: Array<ThcRequestLog> = [];

    constructor (source: Partial<ThcRequestLogPage>) {
        ClassHelper.assign(this, source);
    }
}
