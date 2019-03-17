import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class Theme {
    @primitive()
    themeId: number;
    @primitive()
    title: string;
    @primitive()
    isDefault: boolean;
    @primitive()
    css: string;
    @primitive()
    createdAt: number;
    @primitive()
    updatedAt: number;

    constructor(source?: Partial<Theme>) {
        ClassHelper.assign(this, source);
    }
}

export enum ThemeActions {
    EDIT,
    SAVE,
    DELETE,
    CANCEL,
    DEFAULT
}
