import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class InfractionLevel {
    @primitive()
    infractionLevelId: number;
    @primitive()
    title: string;
    @primitive()
    points: number;
    @primitive()
    lifeTime: number;
    @primitive()
    createdAt: number;

    constructor(source?: Partial<InfractionLevel>) {
        ClassHelper.assign(this, source);
    }
}

export enum InfractionLevelActions {
    SAVE,
    DELETE,
    CANCEL
}
