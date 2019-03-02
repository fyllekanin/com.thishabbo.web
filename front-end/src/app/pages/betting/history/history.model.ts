import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { StatsModel } from '../betting.model';

export class HistoryBet {
    @primitive()
    name: string;
    @primitive()
    result: boolean;
    @primitive()
    placed: number;
    @primitive()
    won: number;

    constructor(source: Partial<HistoryBet>) {
        ClassHelper.assign(this, source);
    }
}

export class HistoryModel {
    @objectOf(StatsModel)
    stats: StatsModel;
    @arrayOf(HistoryBet)
    history: Array<HistoryBet> = [];
    @primitive()
    page: number;
    @primitive()
    total: number;

    constructor(source?: Partial<HistoryModel>) {
        ClassHelper.assign(this, source);
    }
}
