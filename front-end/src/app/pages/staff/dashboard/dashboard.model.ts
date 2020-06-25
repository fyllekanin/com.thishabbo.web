import { ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export interface DisplayResult {
    gold: { points: number, label: string };
    silver: { points: number, label: string };
    bronze: { points: number, label: string };
}

export class YearMonth {
    @primitive()
    year: number;
    @primitive()
    month: number;

    constructor (source: Partial<YearMonth>) {
        ClassHelper.assign(this, source);
    }
}

export class RadioPointsResult {
    @primitive()
    EU: number;
    @primitive()
    NA: number;
    @primitive()
    OC: number;

    constructor (source: Partial<RadioPointsResult>) {
        ClassHelper.assign(this, source);
    }
}

export class RadioPoints {
    @objectOf(YearMonth)
    start: YearMonth;
    @objectOf(YearMonth)
    current: YearMonth;
    @objectOf(RadioPointsResult)
    result: RadioPointsResult;

    constructor (source: Partial<RadioPoints>) {
        ClassHelper.assign(this, source);
    }
}

export class DashboardGeneral {
    @primitive()
    events: number;
    @primitive()
    radio: number;
    @primitive()
    requests: number;
    @primitive()
    thc: number;

    constructor (source: Partial<DashboardGeneral>) {
        ClassHelper.assign(this, source);
    }
}

export class DashboardSlot {
    @primitive()
    day: number;
    @primitive()
    hour: number;

    constructor (source: Partial<DashboardSlot>) {
        ClassHelper.assign(this, source);
    }
}

export class DashboardPersonal {
    @objectOf(DashboardSlot)
    events: DashboardSlot;
    @objectOf(DashboardSlot)
    radio: DashboardSlot;

    constructor (source: Partial<DashboardPersonal>) {
        ClassHelper.assign(this, source);
    }
}

export class DashboardPage {
    @objectOf(DashboardPersonal)
    personal: DashboardPersonal;
    @objectOf(DashboardGeneral)
    general: DashboardGeneral;
    @objectOf(RadioPoints)
    radioPoints: RadioPoints;

    constructor (source: Partial<DashboardPage>) {
        ClassHelper.assign(this, source);
    }
}
