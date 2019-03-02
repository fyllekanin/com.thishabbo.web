import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { AutoBan } from '../auto-ban.model';

export class AutoBansListPage {
    @arrayOf(AutoBan)
    items: Array<AutoBan> = [];
    @primitive()
    page: number;
    @primitive()
    total: number;

    constructor(source: Partial<AutoBansListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum AutoBansActions {
    EDIT,
    DELETE
}

