import { ClassHelper, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { IdHelper } from 'shared/helpers/id.helper';

export class TabModel {
    @primitiveOf(String)
    tabId = IdHelper.newUuid();
    @primitive()
    label: string;
    @primitive()
    url: string;

    constructor (source: Partial<TabModel>) {
        ClassHelper.assign(this, source);
    }
}
