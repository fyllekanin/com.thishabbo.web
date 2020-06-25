import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class Notice {
    @primitive()
    noticeId: number;
    @primitive()
    title: string;
    @primitive()
    text: string;
    @primitive()
    backgroundColor: string;
    @primitive()
    backgroundImage: any;
    @primitive()
    order: number;

    constructor (source?: Partial<Notice>) {
        ClassHelper.assign(this, source);
    }
}
