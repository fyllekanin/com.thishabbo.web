import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class MaintenanceModel {
    @primitive()
    content: string;

    constructor (source?: Partial<MaintenanceModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum MaintenanceActions {
    SAVE,
    BACK
}
