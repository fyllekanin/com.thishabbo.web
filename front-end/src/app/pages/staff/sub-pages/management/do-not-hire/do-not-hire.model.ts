import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class DoNotHireItem {
    @primitive()
    nickname: string;
    @primitive()
    reason: string;
    @primitive()
    addedBy: string;
    @primitive()
    createdAt: number;

    constructor(source?: Partial<DoNotHireItem>) {
        ClassHelper.assign(this, source);
    }
}

export class DoNotHireModel {
    @arrayOf(DoNotHireItem)
    items: Array<DoNotHireItem> = [];

    constructor(source?: Partial<DoNotHireModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum DoNotHireActions {
    EDIT_DNH_ENTRY,
    DELETE_DNH_ENTRY,
    CANCEL,
    DELETE,
    SAVE
}
