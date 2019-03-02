import { arrayOf, ClassHelper, primitive } from 'shared/helpers/class.helper';

export class UserStatisticsModel {
    @primitive()
    day: number;
    @primitive()
    month: number;
    @primitive()
    users: number;

    constructor(source: Partial<UserStatisticsModel>) {
        ClassHelper.assign(this, source);
    }
}

export class UsersStatisticsModel {
    @arrayOf(UserStatisticsModel)
    statistics: Array<UserStatisticsModel> = [];
    @primitive()
    earliestYear: number;
    @primitive()
    latestYear: number;
    @primitive()
    year: number;
    @primitive()
    month: number;

    constructor(source: Partial<UsersStatisticsModel>) {
        ClassHelper.assign(this, source);
    }
}
