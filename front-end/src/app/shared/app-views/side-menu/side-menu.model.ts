import { arrayOf, ClassHelper, primitive, primitiveOf } from 'shared/helpers/class.helper';

export class SideMenuItem {
    @primitive()
    title: string;
    @primitive()
    link: string;
    @primitiveOf(Boolean)
    isApplicable = true;

    constructor(source: {
        title: string,
        link: string,
        isApplicable?: boolean
    }) {
        ClassHelper.assign(this, source);
    }
}

export class SideMenuBlock {
    @primitive()
    title: string;
    @arrayOf(SideMenuItem)
    items: Array<SideMenuItem> = [];

    constructor(source: {
        title: string,
        items: Array<SideMenuItem>
    }) {
        ClassHelper.assign(this, source);
        this.items = this.items.filter(item => item.isApplicable);
    }
}
