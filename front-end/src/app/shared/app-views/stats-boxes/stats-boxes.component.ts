import { Component, Input } from '@angular/core';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';

@Component({
    selector: 'app-stats-boxes',
    templateUrl: 'stats-boxes.component.html',
    styleUrls: ['stats-boxes.component.css']
})
export class StatsBoxesComponent {
    private _stats: Array<StatsBoxModel> = [];

    @Input()
    set stats(stats: Array<StatsBoxModel>) {
        if (Array.isArray(stats) && stats.length > 4) {
            throw Error('Maximum of 4 stats are allowed');
        }
        this._stats = Array.isArray(stats) ? stats : [];
    }

    get stats(): Array<StatsBoxModel> {
        return this._stats;
    }

    get column(): string {
        switch (this._stats.length) {
            case 1:
                return 'small-12';
            case 2:
                return 'small-6';
            case 3:
                return 'small-4';
            case 4:
            default:
                return 'small-3';
        }
    }
}
