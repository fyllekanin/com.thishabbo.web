import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class BadgeViewBadge {
    @primitive()
    badgeId: number;
    @primitive()
    name: string;

    constructor(source: Partial<BadgeViewBadge>) {
        ClassHelper.assign(this, source);
    }
}

export class BadgeView {
    @objectOf(BadgeViewBadge)
    badge: BadgeViewBadge;

    constructor(source: Partial<BadgeView>) {
        ClassHelper.assign(this, source);
    }
}
