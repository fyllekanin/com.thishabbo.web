import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { Badge } from '../badges.model';

export class BadgesListPage {
    @arrayOf(Badge)
    badges: Array<Badge> = [];
    @primitive()
    page: number;
    @primitive()
    total: number;

    constructor (source?: Partial<BadgesListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum BadgeListActions {
    EDIT_BADGE,
    MANAGE_USERS,
    DELETE_BADGE
}
