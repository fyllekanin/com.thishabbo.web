import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class BanOnSightItem {
    @primitive()
    id: number;
    @primitive()
    name: string;
    @primitive()
    reason: string;
    @primitive()
    addedBy: string;
    @primitive()
    createdAt: number;

    constructor (source?: Partial<BanOnSightItem>) {
        ClassHelper.assign(this, source);
    }
}

export enum BanOnSightActions {
    EDIT_BOS_ENTRY,
    DELETE_BOS_ENTRY,
    BACK,
    DELETE,
    SAVE
}
