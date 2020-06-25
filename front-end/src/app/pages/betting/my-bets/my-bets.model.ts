import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { StatsModel } from '../betting.model';

export class MyBet {
    @primitive()
    name: string;
    @primitive()
    odds: string;
    @primitive()
    placed: number;
    @primitive()
    expected: number;

    constructor (source: Partial<MyBet>) {
        ClassHelper.assign(this, source);
    }
}

export class MyBetsModel {
    @objectOf(StatsModel)
    stats: StatsModel;
    @arrayOf(MyBet)
    bets: Array<MyBet> = [];

    constructor (source?: Partial<MyBetsModel>) {
        ClassHelper.assign(this, source);
    }
}
