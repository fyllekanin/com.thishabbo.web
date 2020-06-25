import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class IgnoredThread {
    @primitive()
    threadId: number;
    @primitive()
    title: string;

    constructor (source: Partial<IgnoredThread>) {
        ClassHelper.assign(this, source);
    }
}
