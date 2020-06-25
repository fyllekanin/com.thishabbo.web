import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { STAFFCP_BREADCRUM_ITEM } from '../../../staff.constants';
import { BarChartItem, BarChartModel } from 'shared/components/graph/bar-chart/bar-chart.model';
import { ListenerStatistics } from './listener-statistics.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-staff-management-listener-statistics',
    templateUrl: 'listener-statistics.component.html'
})
export class ListenerStatisticsComponent extends Page implements OnDestroy {
    private _data: ListenerStatistics;

    years: Array<number> = [];
    weeks: Array<number> = [];
    barChartData: BarChartModel;
    selectedRegion = 'EU';
    selectedYear: number;
    selectedWeek: number;

    constructor (
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.selectedYear = Number(activatedRoute.snapshot.params.year);
        this.selectedWeek = Number(activatedRoute.snapshot.params.week);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        this.setWeeks();
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Listener Statistics',
            items: [
                STAFFCP_BREADCRUM_ITEM
            ]
        });
    }

    onDateChange (): void {
        this._router.navigateByUrl(`/staff/management/listener-statistics/${this.selectedYear}/${this.selectedWeek}`);
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onRegionChange (): void {
        this.barChartData = new BarChartModel({
            xLabel: 'Day',
            yLabel: 'Listeners',
            items: this._data.statistics[this.selectedRegion].map((listeners, day) => new BarChartItem({
                xItem: TimeHelper.getDay(day + 1).label,
                yItem: listeners
            }))
        });
    }

    private setWeeks (): void {
        for (let i = 1; i <= 52; i++) {
            this.weeks.push(i);
        }
    }

    private onData (data: { data: ListenerStatistics }): void {
        this._data = data.data;
        const currentYear = new Date().getFullYear();
        this.years = [];
        for (let i = this._data.earliestYear; i <= currentYear; i++) {
            this.years.push(i);
        }
        this.averageListenersOut();
        this.onRegionChange();
    }

    private averageListenersOut (): void {
        Object.keys(this._data.statistics).forEach(key => {
            this._data.statistics[key].forEach((value, index) => {
                this._data.statistics[key][index] = value > 0 ? value / 168 : value;
            });
        });
    }
}
