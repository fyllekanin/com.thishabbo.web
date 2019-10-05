import { ClassHelper, primitive, dateAndTime } from 'shared/helpers/class.helper';

export class BadgeModel {
    @primitive()
    habboBadgeId: string;
    @primitive()
    description: string;
    @primitive()
    isNew: boolean;
    @dateAndTime()
    createdAt: string;

    notFound = false;

    constructor (source: Partial<BadgeModel>) {
        ClassHelper.assign(this, source);
    }

    get url (): string {
        return this.notFound ?
            '/assets/images/badge_error.gif' :
            `https://habboo-a.akamaihd.net/c_images/album1584/${this.habboBadgeId}.gif`;
    }
}
