import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { Ban } from '../../users/ban/ban.model';

export class BansPage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(Ban)
    bans: Array<Ban> = [];

    constructor(source?: Partial<Ban>) {
        ClassHelper.assign(this, source);
    }
}

export enum BansPageAction {
    LIFT_BAN,
    VIEW_BANS
}
