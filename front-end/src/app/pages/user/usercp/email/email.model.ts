import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class EmailModel {
    @primitive()
    email: string;
    @primitive()
    password: string;

    constructor(source?: Partial<EmailModel>) {
        ClassHelper.assign(this, source);
    }
}
