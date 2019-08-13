import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { BadgeModel } from 'shared/components/badges/badges.model';

export class BadgePage {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(BadgeModel)
    items: Array<BadgeModel> = [];

    constructor (source: Partial<BadgePage>) {
        ClassHelper.assign(this, source);
    }
}
