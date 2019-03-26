import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class DashboardGeneral {
    @primitive()
    events: number;
    @primitive()
    radio: number;
    @primitive()
    requests: number;
    @primitive()
    thc: number;

    constructor(source: Partial<DashboardGeneral>) {
        ClassHelper.assign(this, source);
    }
}

export class DashboardSlot {
    @primitive()
    day: number;
    @primitive()
    hour: number;

    constructor(source: Partial<DashboardSlot>) {
        ClassHelper.assign(this, source);
    }
}

export class DashboardPersonal {
    @objectOf(DashboardSlot)
    events: DashboardSlot;
    @objectOf(DashboardSlot)
    radio: DashboardSlot;

    constructor(source: Partial<DashboardPersonal>) {
        ClassHelper.assign(this, source);
    }
}

export class DashboardPage {
    @objectOf(DashboardPersonal)
    personal: DashboardPersonal;
    @objectOf(DashboardGeneral)
    general: DashboardGeneral;

    constructor(source: Partial<DashboardPage>) {
        ClassHelper.assign(this, source);
    }
}
