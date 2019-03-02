import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';
import { InfractionLevel } from '../infraction-level.model';

export class InfractionLevelsListPage {
    @arrayOf(InfractionLevel)
    items: Array<InfractionLevel> = [];
    @primitive()
    page: number;
    @primitive()
    total: number;

    constructor(source: Partial<InfractionLevelsListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum InfractionLevelsActions {
    EDIT,
    DELETE
}
