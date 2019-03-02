import { TitleTopBorder } from 'shared/app-views/title/title.model';
import { Component, Input } from '@angular/core';
import { StatsModel } from '../betting.model';

@Component({
    selector: 'app-betting-stats',
    templateUrl: 'stats.component.html',
    styleUrls: ['stats.component.css']
})
export class StatsComponent {
    private _stats: StatsModel = new StatsModel();

    creditsBorder = TitleTopBorder.GREEN;
    diamondsBorder = TitleTopBorder.BLUE;
    winsBorder = TitleTopBorder.BLUE;
    losesBorder = TitleTopBorder.RED;

    @Input()
    set stats(stats: StatsModel) {
        this._stats = stats || new StatsModel();
    }

    get stats(): StatsModel {
        return this._stats;
    }
}
