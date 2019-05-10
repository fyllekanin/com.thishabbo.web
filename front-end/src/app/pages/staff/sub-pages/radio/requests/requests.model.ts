import { ClassHelper, primitive, time } from 'shared/helpers/class.helper';

export class RequestModel {
    @primitive()
    requestId: number;
    @primitive()
    nickname: string;
    @primitive()
    content: string;
    @primitive()
    ip: string;
    @time()
    createdAt: string;

    constructor (source: Partial<RequestModel>) {
        ClassHelper.assign(this, source);
    }
}

