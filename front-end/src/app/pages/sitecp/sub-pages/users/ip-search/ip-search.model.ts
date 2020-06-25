import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class IpSearchModel {
    @primitive()
    userId: number;
    @primitive()
    nickname: string;
    @primitive()
    ip: string;
    @primitive()
    createdAt: number;

    constructor (source: Partial<IpSearchModel>) {
        ClassHelper.assign(this, source);
    }
}
