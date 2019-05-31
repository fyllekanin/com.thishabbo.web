import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class Badge {
    @primitive()
    badgeId: string;
    @primitive()
    name: string;
    @primitive()
    description: string;
    @primitive()
    points: number;
    @primitive()
    createdAt: number;
    @primitive()
    updatedAt: number;

    constructor (source?: Partial<Badge>) {
        ClassHelper.assign(this, source);
    }
}

export enum BadgeActions {
    SAVE,
    DELETE,
    BACK
}
