import { arrayOf, ClassHelper, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { TitleTopBorder } from 'shared/app-views/title/title.model';

export class SideMenuItem {
    @primitive()
    title: string;
    @primitive()
    link: string;
    @primitiveOf(Boolean)
    isApplicable = true;

    constructor (source: {
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
    @primitiveOf(String)
    top: TitleTopBorder;
    @primitiveOf(String)
    color = '#179bfb';

    constructor (source: {
        title: string,
        items: Array<SideMenuItem>,
        top?: string,
        color?: string
    }) {
        ClassHelper.assign(this, source);
        this.items = this.items.filter(item => item.isApplicable);
    }
}
