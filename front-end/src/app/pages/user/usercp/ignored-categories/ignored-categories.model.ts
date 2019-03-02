import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class IgnoredCategory {
    @primitive()
    categoryId: number;
    @primitive()
    title: string;

    constructor(source: Partial<IgnoredCategory>) {
        ClassHelper.assign(this, source);
    }
}
