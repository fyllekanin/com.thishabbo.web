import { arrayOf, ClassHelper, objectOf, primitive } from 'shared/helpers/class.helper';
import { BetCategoryModel } from '../categories/categories.model';

export class BetModel {
    @primitive()
    betId: number;
    @primitive()
    name: string;
    @primitive()
    leftSide: number;
    @primitive()
    rightSide: number;
    @primitive()
    isFinished: boolean;
    @primitive()
    result: boolean;
    @primitive()
    betCategoryId = 0;
    @primitive()
    createdAt: number;
    @primitive()
    displayOrder: number;

    constructor(source: Partial<BetModel>) {
        ClassHelper.assign(this, source);
    }
}

export class BetPage {
    @objectOf(BetModel)
    bet: BetModel;
    @arrayOf(BetCategoryModel)
    categories: Array<BetCategoryModel> = [];

    constructor(source: {
        bet: BetModel,
        categories: Array<BetCategoryModel>
    }) {
        ClassHelper.assign(this, source);
    }
}

export class BetsListPage {
    @arrayOf(BetModel)
    bets: Array<BetModel> = [];
    @primitive()
    page: number;
    @primitive()
    total: number;

    constructor(source: Partial<BetsListPage>) {
        ClassHelper.assign(this, source);
    }
}

export enum BetActions {
    EDIT_BET,
    DELETE_BET,
    SET_RESULT,
    SAVE,
    DELETE,
    CANCEL
}
