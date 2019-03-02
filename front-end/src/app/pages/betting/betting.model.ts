import { ClassHelper, primitive } from 'shared/helpers/class.helper';

export class StatsModel {
    @primitive()
    credits: number;
    @primitive()
    diamonds: number;
    @primitive()
    betsWon: number;
    @primitive()
    betsLost: number;

    constructor(source?: Partial<StatsModel>) {
        ClassHelper.assign(this, source);
    }
}
