import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { SlimUser } from 'core/services/auth/auth.model';

export class InfractionItem {
    @primitive()
    infractionId: number;
    @primitive()
    title: string;
    @primitive()
    reason: string;
    @objectOf(SlimUser)
    user: SlimUser;
    @objectOf(SlimUser)
    by: SlimUser;
    @primitive()
    isDeleted: boolean;
    @primitive()
    createdAt: number;

    constructor(source: Partial<InfractionItem>) {
        ClassHelper.assign(this, source);
    }
}

export class InfractionsPage {
    @primitive()
    page: number;
    @primitive()
    total: number;
    @arrayOf(InfractionItem)
    items: Array<InfractionItem> = [];

    constructor(source: Partial<InfractionsPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum InfractionsPageActions {
    DETAILS,
    REVERSE
}
