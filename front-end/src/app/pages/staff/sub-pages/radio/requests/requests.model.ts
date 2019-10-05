import { arrayOf, ClassHelper, primitive, dateAndTime } from 'shared/helpers/class.helper';

export class RequestModel {
    @primitive()
    requestId: number;
    @primitive()
    nickname: string;
    @primitive()
    content: string;
    @primitive()
    ip: string;
    @dateAndTime()
    createdAt: string;

    constructor (source: Partial<RequestModel>) {
        ClassHelper.assign(this, source);
    }
}

export class RequestsPage {
    @primitive()
    canDeleteRequests: boolean;
    @arrayOf(RequestModel)
    items: Array<RequestModel> = [];

    constructor (source: Partial<RequestsPage>) {
        ClassHelper.assign(this, source);
    }
}

