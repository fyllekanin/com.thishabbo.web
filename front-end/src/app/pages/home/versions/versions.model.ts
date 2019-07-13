import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ChangeItem {
    @primitive()
    topic: string;
    @primitive()
    type: string;
    @primitive()
    body: string;

    class: string;

    constructor (source: Partial<ChangeItem>) {
        ClassHelper.assign(this, source);
        this.class = this.type.replace(new RegExp(' ', 'g'), '-')
            .replace('/', '')
            .replace('--', '-')
            .toLowerCase();
    }
}

export class VersionItem {
    @primitive()
    version: string;
    @arrayOf(ChangeItem)
    changes: Array<ChangeItem> = [];

    constructor (source: Partial<VersionItem>) {
        ClassHelper.assign(this, source);
    }
}

export class VersionsPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(VersionItem)
    items: Array<VersionItem> = [];

    constructor (source: Partial<VersionsPage>) {
        ClassHelper.assign(this, source);
    }
}
