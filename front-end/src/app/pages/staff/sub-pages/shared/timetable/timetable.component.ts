import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'core/services/auth/auth.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { Page } from 'shared/page/page.model';
import {
    STAFFCP_BREADCRUM_ITEM,
    STAFFCP_EVENTS_BREADCRUM_ITEM,
    STAFFCP_RADIO_BREADCRUM_ITEM
} from '../../../staff.constants';
import { SelectionComponent } from './selection/selection.component';
import { TimetablePage, TimetableModel } from 'shared/models/timetable.model';
import { TimetableHelper } from 'shared/helpers/timetable.helper';

@Component({
    selector: 'app-staff-timetable',
    templateUrl: 'timetable.component.html',
    styleUrls: ['timetable.component.css']
})
export class TimetableComponent extends Page implements OnDestroy {
    private readonly _type;
    private _data: TimetablePage = new TimetablePage();
    private _timezones: Array<string> = [];

    tabs: Array<TitleTab> = [];

    constructor (
        private _dialogService: DialogService,
        private _authService: AuthService,
        private _router: Router,
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _componentFactory: ComponentFactoryResolver,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this._type = activatedRoute.snapshot.data['type'];
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        this.addSubscription(activatedRoute.params, this.onDayChange.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Timetable',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                (this._type === 'events' ? STAFFCP_EVENTS_BREADCRUM_ITEM : STAFFCP_RADIO_BREADCRUM_ITEM)
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (value: number): void {
        this._router.navigateByUrl(`/staff/${this._type}/timetable/${value}`);
    }

    isBooked (hour: number): boolean {
        return Boolean(this.getTimetableByHour(hour));
    }

    getNickname (hour: number): string {
        const timetable = this.getTimetableByHour(hour);
        const linkIcon = this._type === 'events' ? (timetable.link ? '<i class="far fa-thumbs-up"></i>' :
            '<i class="far fa-thumbs-down"></i>') : '';
        return `${timetable.user.nickname}<br /> ${this.getEventName(timetable)} ${linkIcon}`;
    }

    clickHour (hour: number): void {
        const timetable = this.getTimetableByHour(hour);
        if (timetable) {
            this.unbook(timetable);
        } else {
            this.book(hour);
        }
    }

    isCurrentSlot (hour: number): boolean {
        return TimetableHelper.isCurrentSlot(this.getCurrentDay(), hour);
    }

    get timezones (): Array<string> {
        return this._timezones;
    }

    private getEventName (timetable: TimetableModel): string {
        return TimetableHelper.getEventName(timetable, this.isEvents());
    }

    private book (hour: number): void {
        this._dialogService.openDialog({
            title: 'Booking',
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Book',
                    callback: (res: { nickname: string, eventId: number, link: string }) => this.onBook(hour, res)
                })
            ],
            component: this.isEvents() || this.canBookRadioForOther() ?
                this._componentFactory.resolveComponentFactory(SelectionComponent) : null,
            content: 'Are you sure you want to book this slot?',
            data: {
                events: this._data.events,
                canBookRadioForOther: this.canBookRadioForOther(),
                canBookEventForOther: this.canBookEventForOther(),
                isEvents: this.isEvents()
            }
        });
    }

    private canBookEventForOther (): boolean {
        return this._authService.staffPermissions.canBookEventForOthers;
    }

    private canBookRadioForOther (): boolean {
        return this._authService.staffPermissions.canBookRadioForOthers;
    }

    private isEvents (): boolean {
        return this._type === 'events';
    }

    private onBook (hour: number, res: { nickname: string, eventId: number, link: string }): void {
        const currentDay = this.getCurrentDay();

        const offsetInHours = hour + (new Date().getTimezoneOffset() / 60);
        const convertedHour = TimeHelper.getConvertedHour(offsetInHours);
        const convertedDay = TimeHelper.getConvertedDay(offsetInHours, currentDay);

        this._httpService.post(`staff/${this._type}/timetable`, {
            booking: {
                day: convertedDay,
                hour: convertedHour,
                nickname: res ? res.nickname : null,
                eventId: res ? res.eventId : null,
                link: res ? res.link : null
            }
        })
            .subscribe(response => {
                this.onSuccessBooking(currentDay, hour, response);
            }, error => {
                this._notificationService.failureNotification(error);
            });
    }

    private onSuccessBooking (day, hour, item): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Slot booked'
        }));
        this._data.timetable.push(new TimetableModel({
            timetableId: item.timetableId,
            day: day,
            hour: hour,
            isPerm: false,
            user: item.user,
            createdAt: item.createdAt,
            event: item.event,
            link: item.link
        }));
        this._dialogService.closeDialog();
    }

    private unbook (timetable: TimetableModel): void {
        const permission = this.isEvents() ? this._authService.staffPermissions.canBookEventForOthers :
            this._authService.staffPermissions.canBookRadioForOthers;
        if (timetable.user.userId !== this._authService.authUser.userId && !permission) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Error',
                message: 'You do not have permission to unbook someone elses slot'
            }));
            return;
        }

        this._dialogService.confirm({
            title: `Unbooking`,
            content: `Are you sure you want to unbook ${timetable.user.nickname}'s slot?`,
            callback: () => {
                this._dialogService.closeDialog();
                this._httpService.delete(`staff/${this._type}/timetable/${timetable.timetableId}`)
                    .subscribe(() => {
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Slot unbooked'
                        }));
                        this._data.timetable = this._data.timetable.filter(item => item.timetableId !== timetable.timetableId);
                    });
            }
        });
    }

    private onDayChange (params): void {
        this.tabs = TimeHelper.DAYS.map(day => new TitleTab({
            title: day.abbr,
            value: day.number,
            isActive: Number(params['day']) === day.number
        })).reverse();
    }

    private getTimetableByHour (hour: number): TimetableModel {
        return TimetableHelper.getSlot(this._data.timetable, this.getCurrentDay(), hour);
    }

    private onData (data: { data: TimetablePage }): void {
        this._data = data.data;
        this._data.timetable = TimetableHelper.correctTimeones(this._data.timetable);
        const offset = TimeHelper.getTimeOffsetInHours();
        this._data.timezones.forEach((region, index) => {
            const newIndex = TimeHelper.getConvertedHour(index + offset);
            this._timezones[newIndex] = region;
        });
    }

    private getCurrentDay (): number {
        return Number(this.tabs.find(tab => tab.isActive).value);
    }
}
