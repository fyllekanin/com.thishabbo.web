import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class ThreadStatisticsModel {
    @primitive()
    day: number;
    @primitive()
    month: number;
    @primitive()
    threads: number;

    constructor(source: Partial<ThreadStatisticsModel>) {
        ClassHelper.assign(this, source);
    }
}

export class ThreadsStatisticsModel {
    @arrayOf(ThreadStatisticsModel)
    statistics: Array<ThreadStatisticsModel> = [];
    @primitive()
    earliestYear: number;
    @primitive()
    latestYear: number;
    @primitive()
    year: number;
    @primitive()
    month: number;

    constructor(source: Partial<ThreadStatisticsModel>) {
        ClassHelper.assign(this, source);
    }
}
