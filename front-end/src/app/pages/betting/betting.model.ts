import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';
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

export function getBettingStats(stats: StatsModel): Array<StatsBoxModel> {
    return [
        new StatsBoxModel({
            borderColor: TitleTopBorder.GREEN,
            title: String(stats.credits),
            breadText: 'ThisHabboCredits',
            icon: 'fas fa-coins'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.BLUE,
            title: String(stats.diamonds),
            breadText: 'Diamonds',
            icon: 'fas fa-gem'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.BLUE,
            title: String(stats.betsWon),
            breadText: 'Bets Won',
            icon: 'fas fa-thumbs-up'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.RED,
            title: String(stats.betsLost),
            breadText: 'Bets Lost',
            icon: 'fas fa-thumbs-down'
        })
    ];
}
