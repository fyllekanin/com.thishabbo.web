import { ClassHelper } from 'shared/helpers/class.helper';
import { primitive } from 'shared/helpers/class.helper';

export class Signature {
    @primitive()
    signature: string;
    @primitive()
    parsedSignature: string;

    constructor(source?: Partial<Signature>) {
        ClassHelper.assign(this, source);
    }
}

export enum SignatureActions {
    SAVE
}
