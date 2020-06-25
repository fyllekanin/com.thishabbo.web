import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';

export class RegionStatistics {
    @arrayOf(Number)
    EU: Array<number> = [];
    @arrayOf(Number)
    OC: Array<number> = [];
    @arrayOf(Number)
    NA: Array<number> = [];

    constructor (source: Partial<RegionStatistics>) {
        ClassHelper.assign(this, source);
    }
}

export class ListenerStatistics {
    @primitive()
    earliestYear: number;
    @objectOf(RegionStatistics)
    statistics: RegionStatistics;

    constructor (source: Partial<ListenerStatistics>) {
        ClassHelper.assign(this, source);
    }
}
