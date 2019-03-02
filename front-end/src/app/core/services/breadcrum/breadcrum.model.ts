import { ClassHelper, arrayOf, primitive } from 'shared/helpers/class.helper';

export class BreadcrumbItem {
    @primitive()
    title: string;
    @primitive()
    url: string;

    constructor(source: {
        title: string,
        url: string
    }) {
        ClassHelper.assign(this, source);
    }
}

export class Breadcrumb {
    @primitive()
    current: string;
    @arrayOf(BreadcrumbItem)
    items: Array<BreadcrumbItem> = [];

    constructor(source: {
        current: string,
        items?: Array<BreadcrumbItem>
    }) {
        ClassHelper.assign(this, source);
    }
}
