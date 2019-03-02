import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class RequestModel {
    @primitive()
    requestId: number;
    @primitive()
    nickname: string;
    @primitive()
    content: string;
    @primitive()
    ip: string;
    @primitive()
    createdAt: number;

    constructor(source: Partial<RequestModel>) {
        ClassHelper.assign(this, source);
    }
}

