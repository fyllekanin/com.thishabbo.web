import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ThemeModel {
    @primitive()
    themeId: number;
    @primitive()
    title: string;
    @primitive()
    isSelected: boolean;
    @primitive()
    minified: string;

    constructor(source: Partial<ThemeModel>) {
        ClassHelper.assign(this, source);
    }
}
