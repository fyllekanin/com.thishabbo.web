import { ClassHelper, primitive, primitiveOf } from 'shared/helpers/class.helper';

export class BBcodeModel {
    @primitive()
    bbcodeId: number;
    @primitive()
    name: string;
    @primitive()
    example: string;
    @primitive()
    pattern: string;
    @primitive()
    replace: string;
    @primitive()
    content: string;
    @primitive()
    createdAt: number;
    @primitiveOf(Boolean)
    isEmoji = false;
    @primitive()
    isSystem: boolean;

    constructor (source?: Partial<BBcodeModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum BBcodeActions {
    EDIT_BBCODE,
    DELETE_BBCODE,
    BACK,
    DELETE,
    SAVE
}
