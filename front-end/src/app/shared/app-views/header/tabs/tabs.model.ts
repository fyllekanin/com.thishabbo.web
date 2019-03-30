import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class TabModel {
    @primitive()
    label: string;
    @primitive()
    url: string;

    constructor(source: Partial<TabModel>) {
        ClassHelper.assign(this, source);
    }
}
