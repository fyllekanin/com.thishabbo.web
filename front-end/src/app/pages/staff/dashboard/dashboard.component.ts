import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { STAFFCP_BREADCRUM_ITEM } from '../staff.constants';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardPage, DashboardSlot, DisplayResult } from './dashboard.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { ArrayHelper } from 'shared/helpers/array.helper';

@Component({
    selector: 'app-staff-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: [ 'dashboard.component.css' ]
})

export class DashboardComponent extends Page implements OnInit, OnDestroy {
    private _data: DashboardPage;
    private _activeStats: Array<StatsBoxModel> = [];
    private _generalStats: Array<StatsBoxModel> = [];
    private _personalStats: Array<StatsBoxModel> = [];
    private _timeLeftInterval = null;

    possibleYears: Array<number> = [];
    possibleMonths: Array<{ label: string, value: number }> = [];
    selectedYear: number;
    selectedMonth: number;

    untilWeekDays = '';
    untilWeekend = '';

    result: DisplayResult = null;

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Personal', isActive: false, value: 1 }),
        new TitleTab({ title: 'General', isActive: true, value: 0 })
    ];

    constructor (
        private _router: Router,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Dashboard',
            items: [ STAFFCP_BREADCRUM_ITEM ]
        });
        this._activeStats = this._generalStats;
    }

    onTabClick (isPersonal: number): void {
        this._activeStats = Boolean(isPersonal) ? this._personalStats : this._generalStats;
        this.tabs.forEach(tab => {
            tab.isActive = tab.value === isPersonal;
        });
    }

    onDateChange (): void {
        this._router.navigateByUrl(`/staff/dashboard/${this.selectedYear}/${this.selectedMonth}/points`);
    }

    ngOnInit (): void {
        const nextMonday = this.getNextMondayDate();
        const nextSaturday = this.getNextSaturdayDate();
        this._timeLeftInterval = setInterval(() => {
            this.untilWeekend = TimeHelper.getUntil(nextMonday);
            this.untilWeekDays = TimeHelper.getUntil(nextSaturday);
        }, 1000);
    }

    ngOnDestroy (): void {
        super.destroy();
        clearInterval(this._timeLeftInterval);
    }

    get stats (): Array<StatsBoxModel> {
        return this._activeStats;
    }

    private onData (data: { data: DashboardPage }): void {
        this._data = data.data;
        this.selectedYear = this._data.radioPoints.current.year;
        this.selectedMonth = this._data.radioPoints.current.month;
        this.possibleYears = this.getPossibleYears();
        this.possibleMonths = this.getPossibleMonths();
        this.result = this.getResult();

        this.buildGeneralStats();
        this.buildPersonalStats();
    }

    private getResult (): DisplayResult {
        const list = Object.keys(this._data.radioPoints.result).map(key => {
            return { label: key, points: this._data.radioPoints.result[key] };
        });
        list.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'points'));

        return {
            gold: list[0],
            silver: list[1],
            bronze: list[2]
        };
    }

    private getPossibleYears (): Array<number> {
        const possibleYears = [];
        const currentYear = new Date().getFullYear() + 1;

        for (let i = this._data.radioPoints.start.year; i < currentYear; i++) {
            possibleYears.push(i);
        }

        return possibleYears;
    }

    private getPossibleMonths (): Array<{ label: string, value: number }> {
        const possibleMonths: Array<{ label: string, value: number }> = [];

        if (this.selectedYear === this._data.radioPoints.start.year) {
            for (let i = this._data.radioPoints.start.month; i < 13; i++) {
                possibleMonths.push({ label: TimeHelper.FULL_MONTHS[i - 1], value: i });
            }
        } else {
            const currentMonth = new Date().getMonth() + 2;
            for (let i = 1; i < currentMonth; i++) {
                possibleMonths.push({ label: TimeHelper.FULL_MONTHS[i - 1], value: i });
            }
        }

        return possibleMonths;
    }

    private buildPersonalStats (): void {
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
                breadText: radio ? 'Upcoming Radio Slot' : '¯\\_(ツ)_/¯'
            })
        ];
    }

    private getText (slot: DashboardSlot): string {
        if (!slot) {
            return null;
        }

        const convertedHour = slot.hour + TimeHelper.getTimeOffsetInHours();
        const day = TimeHelper.getConvertedDay(convertedHour, slot.day);
        const hour = TimeHelper.getHours().find(item => item.number === TimeHelper.getConvertedHour(convertedHour));

        return `${TimeHelper.getDay(day).label} - ${hour.label}`;
    }

    private buildGeneralStats (): void {
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

    private getNextMondayDate (): Date {
        const date = new Date();
        switch (date.getUTCDay()) {
            case 0:
                date.setUTCDate(date.getUTCDate() + 1);
                break;
            case 1:
                date.setUTCDate(date.getUTCHours() < 7 ? date.getUTCDate() : date.getUTCDate() + 7);
                break;
            default:
                date.setUTCDate(date.getUTCDate() + (8 - date.getUTCDay()));
                break;
        }
        date.setUTCHours(7, 0, 0, 0);
        return date;
    }

    private getNextSaturdayDate (): Date {
        const date = new Date();
        switch (date.getUTCDay()) {
            case 6:
                date.setUTCDate(date.getUTCHours() < 7 ? date.getUTCDate() : date.getUTCDate() + 7);
                break;
            default:
                date.setUTCDate(date.getUTCDate() + (6 - date.getUTCDay()));
                break;
        }
        date.setUTCHours(7, 0, 0, 0);
        return date;
    }
}
