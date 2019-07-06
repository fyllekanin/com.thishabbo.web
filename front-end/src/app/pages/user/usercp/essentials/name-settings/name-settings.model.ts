import { ClassHelper, arrayOf, primitive } from 'shared/helpers/class.helper';

export class NameSettings {
    @arrayOf(String)
    colors: Array<string> = [];
    @primitive()
    canUpdateSettings: boolean;

    constructor(source?: Partial<NameSettings>) {
        ClassHelper.assign(this, source);
    }
}
