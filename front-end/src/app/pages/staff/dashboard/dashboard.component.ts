import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { STAFFCP_BREADCRUM_ITEM } from '../staff.constants';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
import { ActivatedRoute } from '@angular/router';
import { DashboardPage, DashboardSlot } from './dashboard.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-staff-dashboard',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent extends Page implements OnDestroy {
    private _data: DashboardPage;
    private _activeStats: Array<StatsBoxModel> = [];
    private _generalStats: Array<StatsBoxModel> = [];
    private _personalStats: Array<StatsBoxModel> = [];

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Personal', isActive: false, value: 1 }),
        new TitleTab({ title: 'General', isActive: true, value: 0 })
    ];

    constructor(
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Dashboard',
            items: [STAFFCP_BREADCRUM_ITEM]
        });
        this._activeStats = this._generalStats;
    }

    onTabClick(isPersonal: number): void {
        this._activeStats = Boolean(isPersonal) ? this._personalStats : this._generalStats;
        this.tabs.forEach(tab => {
            tab.isActive = tab.value === isPersonal;
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    get stats(): Array<StatsBoxModel> {
        return this._activeStats;
    }

    private onData(data: { data: DashboardPage }): void {
        this._data = data.data;

        this.buildGeneralStats();
        this.buildPersonalStats();
    }

    private buildPersonalStats(): void {
        const events = this.getText(this._data.personal.events);
        const radio = this.getText(this._data.personal.radio);

        this._personalStats = [
            new StatsBoxModel({
                borderColor: TitleTopBorder.RED,
                icon: 'fas fa-calendar-alt',
                title: events || 'Not Booked',
                breadText: events ? 'Upcoming Events Slot' : '¯\\_(ツ)_/¯'
            }),
            new StatsBoxModel({
                borderColor: TitleTopBorder.GREEN,
                icon: 'fas fa-headphones',
                title: radio || 'Not Booked',
                breadText: radio ? 'Upcoming Events Slot' : '¯\\_(ツ)_/¯'
            })
        ];
    }

    private getText(slot: DashboardSlot): string {
        if (!slot) {
            return null;
        }

        const convertedHour = slot.hour + TimeHelper.getTimeOffsetInHours();
        const day = this.getDay(convertedHour, slot.day);
        const hour = TimeHelper.getHours().find(item => item.number === this.getHour(convertedHour));

        return `${TimeHelper.getDay(day).label} - ${hour.label}`;
    }

    private buildGeneralStats(): void {
        this._generalStats = [
            new StatsBoxModel({
                borderColor: TitleTopBorder.GREEN,
                icon: 'fas fa-calendar-alt',
                title: `${this._data.general.events} / 168`,
                breadText: 'Event Slots Booked'
            }),
            new StatsBoxModel({
                borderColor: TitleTopBorder.RED,
                icon: 'fas fa-headphones',
                title: `${this._data.general.radio} / 168`,
                breadText: 'Radio Slots Booked'
            }),
            new StatsBoxModel({
                borderColor: TitleTopBorder.BLUE,
                icon: 'fas fa-heart',
                title: String(this._data.general.requests),
                breadText: 'Radio Requests This Week'
            }),
            new StatsBoxModel({
                borderColor: TitleTopBorder.PINK,
                icon: 'fas fa-comment',
                title: String(this._data.general.thc),
                breadText: 'THC Requests This Week'
            })
        ];
    }

    private getDay(convertedHour: number, day: number): number {
        if (convertedHour > 23) {
            return day === 7 ? 1 : day + 1;
        } else if (convertedHour < 0) {
            return day === 1 ? 7 : day - 1;
        }
        return day;
    }

    private getHour(convertedHour: number): number {
        if (convertedHour > 23) {
            return convertedHour - 24;
        } else if (convertedHour < 0) {
            return convertedHour + 24;
        }
        return convertedHour;
    }
}
