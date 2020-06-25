import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ThreadsStatisticsModel } from './threads-statistics.model';
import { BarChartItem, BarChartModel } from 'shared/components/graph/bar-chart/bar-chart.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-statistics-thread',
    templateUrl: 'threads-statistics.component.html'
})
export class ThreadsStatisticsComponent extends Page implements OnDestroy {
    private _data: ThreadsStatisticsModel;

    barChartData: BarChartModel = null;

    constructor (
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    get months (): Array<{ number: number, name: string }> {
        return TimeHelper.FULL_MONTHS.map((item, index) => {
            return {
                number: index + 1,
                name: item
            };
        });
    }

    get years (): Array<number> {
        const years = [];
        for (let i = this._data.earliestYear; i <= this._data.latestYear; i++) {
            years.push(i);
        }
        return years;
    }

    get model (): ThreadsStatisticsModel {
        return this._data;
    }

    onDateChange (): void {
        this._router.navigateByUrl(`/sitecp/statistics/threads/${this._data.year}/${this._data.month}?skipScroll=true`);
    }

    private onData (data: { data: ThreadsStatisticsModel }): void {
        this._data = data.data;
        this.barChartData = new BarChartModel({
            xLabel: 'Amount',
            yLabel: 'Threads',
            items: this._data.statistics.map(item => new BarChartItem({
                yItem: item.threads,
                xItem: `${item.day}/${item.month}`
            }))
        });
    }
}
