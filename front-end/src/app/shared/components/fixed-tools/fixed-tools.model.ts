import { IdHelper } from 'shared/helpers/id.helper';
import { ClassHelper } from 'shared/helpers/class.helper';
import { primitive, arrayOf } from 'shared/helpers/class.helper';


export class FixedToolItem {
    @primitive()
    id: string = IdHelper.newUuid();
    @primitive()
    title: string;
    @primitive()
    value: number;
    @arrayOf(FixedToolItem)
    children: Array<FixedToolItem> = [];

    constructor(source: Partial<FixedToolItem>) {
        ClassHelper.assign(this, source);
    }
}

export class FixedTools {
    @arrayOf(FixedToolItem)
    items: Array<FixedToolItem> = [];

    constructor(source?: Partial<FixedTools>) {
        ClassHelper.assign(this, source);
    }
}
