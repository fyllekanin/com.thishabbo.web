import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { StatsModel } from '../betting.model';

export class Bet {
    @primitive()
    backersCount: number;
    @primitive()
    betId: number;
    @primitive()
    betCategoryId: number;
    @primitive()
    leftSide: number;
    @primitive()
    rightSide: number;
    @primitive()
    name: string;
    @primitive()
    isSuspended: boolean;

    constructor (source: Partial<Bet>) {
        ClassHelper.assign(this, source);
    }
}

export class BetCategory {
    @primitive()
    betCategoryId: number;
    @arrayOf(Bet)
    activeBets: Array<Bet> = [];
    @primitive()
    createdAt: number;
    @primitive()
    displayOrder: number;
    @primitive()
    name: string;
    @primitive()
    updatedAt: number;

    constructor (source: Partial<BetCategory>) {
        ClassHelper.assign(this, source);
    }
}

export class DashboardModel {
    @objectOf(StatsModel)
    stats: StatsModel;
    @arrayOf(Bet)
    trendingBets: Array<Bet> = [];
    @arrayOf(BetCategory)
    activeBets: Array<BetCategory> = [];

    constructor (source?: Partial<DashboardModel>) {
        ClassHelper.assign(this, source);
    }
}

export enum BetDashboardListActions {
    PLACE_BET
}
