import { ClassHelper, arrayOf, primitive } from 'shared/helpers/class.helper';

export class NameColour {
    @arrayOf(String)
    colours: Array<string> = [];
    @primitive()
    canUpdateColour: boolean;

    constructor(source?: Partial<NameColour>) {
        ClassHelper.assign(this, source);
    }
}
