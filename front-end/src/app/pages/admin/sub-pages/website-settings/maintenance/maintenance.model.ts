import { primitive, ClassHelper } from 'shared/helpers/class.helper';

export class MaintenanceModel {
    @primitive()
    content: string;

    constructor(source?: Partial<MaintenanceModel>) {
        ClassHelper.assign(this, source);
    }
}
