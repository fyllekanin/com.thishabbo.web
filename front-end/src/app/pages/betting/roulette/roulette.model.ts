import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { StatsModel } from '../betting.model';

export class RouletteModel {
    @objectOf(StatsModel)
    stats: StatsModel;

    constructor (source?: Partial<RouletteModel>) {
        ClassHelper.assign(this, source);
    }
}

export class RouletteNumber {
    @primitive()
    number: number;
    @primitive()
    color: string;

    constructor (source: Partial<RouletteNumber>) {
        ClassHelper.assign(this, source);
    }
}

export class Roulette {
    @arrayOf(RouletteNumber)
    numbers: Array<RouletteNumber> = [];
    @primitive()
    isWin: boolean;
    @primitive()
    profit: number;
    @objectOf(RouletteNumber)
    winner: RouletteNumber;
    @primitive()
    boxNumber: number;

    constructor (source: Partial<Roulette>) {
        ClassHelper.assign(this, source);
    }
}
