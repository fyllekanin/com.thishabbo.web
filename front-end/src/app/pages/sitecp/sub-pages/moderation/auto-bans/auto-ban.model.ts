import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class AutoBan {
    @primitive()
    autoBanId: number;
    @primitive()
    title: string;
    @primitive()
    amount: number;
    @primitive()
    banLength: number;
    @primitive()
    reason: string;
    @primitive()
    updatedAt: number;

    constructor (source?: Partial<AutoBan>) {
        ClassHelper.assign(this, source);
    }
}

export enum AutoBanActions {
    SAVE,
    DELETE,
    BACK
}
