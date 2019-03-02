import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class TitleTab {
    @primitive()
    title: string;
    @primitive()
    value: number;
    @primitive()
    link: string;
    @primitive()
    isActive: boolean;

    constructor (source: {
        title: string,
        value?: number,
        link?: string,
        isActive?: boolean
    }) {
        ClassHelper.assign(this, source);
    }
}

export class TitleTopBorder {

    static readonly BLUE = 'blue-top';

    static readonly PINK = 'pink-top';

    static readonly GREEN = 'green-top';

    static readonly RED = 'red-top';
}
