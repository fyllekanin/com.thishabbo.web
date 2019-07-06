import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class SelectableBadgeItem {
    @primitive()
    badgeId: number;
    @primitive()
    name: string;
    @primitive()
    points: number;
    @primitive()
    updatedAt: number;

    constructor (source: Partial<SelectableBadgeItem>) {
        ClassHelper.assign(this, source);
    }

    getResource (): string {
        return `<img src="/rest/resources/images/badges/${this.badgeId}.gif?${this.updatedAt}" />`;
    }
}

export class SelectableBadges {
    @primitive()
    total: number;
    @primitive()
    page: number;
    @arrayOf(SelectableBadgeItem)
    items: Array<SelectableBadgeItem> = [];

    constructor (source: Partial<SelectableBadgeItem>) {
        ClassHelper.assign(this, source);
    }
}
