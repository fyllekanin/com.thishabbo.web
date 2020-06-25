import { arrayOf, ClassHelper, primitive, primitiveOf } from 'shared/helpers/class.helper';
import { IdHelper } from 'shared/helpers/id.helper';

export abstract class NavigationItem {
    @primitiveOf(String)
    id = IdHelper.newUuid();
    @primitive()
    label: string;
    @primitive()
    url: string;
    @primitive()
    loginRequired: boolean;
    @primitive()
    isLogout: boolean;
    @primitive()
    isOnMobile: boolean;
    @primitive()
    isDivider: boolean;
    @primitive()
    isHomePage: boolean;
}

export class ChildItem extends NavigationItem {
    constructor (source: Partial<ChildItem>) {
        super();
        ClassHelper.assign(this, source);

        if (this.isDivider) {
            this.label = IdHelper.newUuid();
        }
    }
}

export class MainItem extends NavigationItem {
    @primitive()
    isExpanded: boolean;
    @arrayOf(ChildItem)
    children: Array<ChildItem> = [];
    @primitive()
    icon: string;

    constructor (source: Partial<MainItem>) {
        super();
        ClassHelper.assign(this, source);
    }

    get haveChildren (): boolean {
        return this.children.length > 0;
    }
}


