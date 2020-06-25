import { ClassHelper, dateAndTime, primitive } from 'shared/helpers/class.helper';

export class BadgeModel {
    @primitive()
    habboBadgeId: string;
    @primitive()
    description: string;
    @primitive()
    isNew: boolean;
    @dateAndTime()
    createdAt: string;

    constructor (source: Partial<BadgeModel>) {
        ClassHelper.assign(this, source);
    }
}
