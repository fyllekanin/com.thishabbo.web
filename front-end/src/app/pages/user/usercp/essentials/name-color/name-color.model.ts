import { ClassHelper, arrayOf, primitive } from 'shared/helpers/class.helper';

export class NameColor {
    @arrayOf(String)
    colors: Array<string> = [];
    @primitive()
    canUpdateColor: boolean;

    constructor(source?: Partial<NameColor>) {
        ClassHelper.assign(this, source);
    }
}
