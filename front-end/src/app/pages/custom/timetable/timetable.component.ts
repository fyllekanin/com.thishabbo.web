import { Component, ElementRef, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { TimeHelper, Day, Hour } from 'shared/helpers/time.helper';
import { SlimUser } from 'core/services/auth/auth.model';
import { TimetablePage } from 'shared/models/timetable.model';
import { TimetableHelper } from 'shared/helpers/timetable.helper';

@Component({
    selector: 'app-timetable',
    templateUrl: 'timetable.component.html',
    styleUrls: ['timetable.component.css']
})
export class TimetableComponent extends Page implements OnDestroy {
    private readonly _type;
    private _data: TimetablePage = new TimetablePage();

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this._type = activatedRoute.snapshot.data['type'];
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: this.title
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    isBooked (day: number, hour: number): boolean {
        return Boolean(TimetableHelper.getSlot(this._data.timetable, day, hour));
    }

    getHabboName (day: number, hour: number): string {
        const slot = TimetableHelper.getSlot(this._data.timetable, day, hour);
        return slot.user.habbo;
    }

    getEventName (day: number, hour: number): string {
        return TimetableHelper.getEventName(TimetableHelper.getSlot(this._data.timetable, day, hour), this.isEvents());
    }

    getUser (day: number, hour: number): SlimUser {
        const slot = TimetableHelper.getSlot(this._data.timetable, day, hour);
        return slot.user;
    }

    isCurrentSlot (day: number, hour: number): boolean {
        return TimetableHelper.isCurrentSlot(day, hour);
    }

    get title (): string {
        return this.isEvents() ? 'Events Timetable' : 'Radio Timetable';
    }

    get days (): Array<Day> {
        return TimeHelper.DAYS;
    }

    get hours (): Array<Hour> {
        return TimeHelper.getHours();
    }

    private isEvents (): boolean {
        return this._type === 'events';
    }

    private onData (data: { data: TimetablePage }): void {
        this._data = data.data;
    }

}
