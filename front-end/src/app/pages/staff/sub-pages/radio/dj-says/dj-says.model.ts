import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class DjSaysModel {
    @primitive()
    says: string;
    @primitive()
    canUpdate: boolean;

    constructor(source?: Partial<DjSaysModel>) {
        ClassHelper.assign(this, source);
    }
}
