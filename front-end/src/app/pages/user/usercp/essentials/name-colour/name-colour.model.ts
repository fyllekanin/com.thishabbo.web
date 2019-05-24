import { ClassHelper, arrayOf } from 'shared/helpers/class.helper';

export class NameColour {
    @arrayOf(String)
    colours: Array<string> = [];

    constructor(source?: Partial<NameColour>) {
        ClassHelper.assign(this, source);
    }
}

export enum NameColourActions {
    SAVE
}
