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
import { TimetableModel, TimetablePage } from './timetable.model';
import { SelectionComponent } from './selection/selection.component';

@Component({
    selector: 'app-staff-timetable',
    templateUrl: 'timetable.component.html',
    styleUrls: ['timetable.component.css']
})
export class TimetableComponent extends Page implements OnDestroy {
    private readonly _type;
    private _page: TimetablePage = new TimetablePage();

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
        return `<span style="${timetable.user.styling}">${timetable.user.nickname}</span> <br />` +
            `${this.getEventName(timetable)} ${linkIcon}`;
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
        const selectedDay = this.getCurrentDay();
        const date = new Date();
        if (date.getDay() !== selectedDay) {
            return false;
        }

        return hour === date.getHours();
    }

    private getEventName (timetable: TimetableModel): string {
        if (!timetable.isPerm) {
            return this.isEvents() ? `(${timetable.event ? timetable.event.name : 'unknown'})` : '';
        }
        return `(${timetable.name})`;
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
            content: 'Sure you wanna book this slot?',
            data: {
                events: this._page.events,
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
        const convertedHour = this.getHour(offsetInHours);
        const convertedDay = this.getDay(offsetInHours, currentDay);

        this._httpService.post(`staff/${this._type}/timetable`, {
            booking: {
                day: convertedDay,
                hour: convertedHour,
                nickname: res.nickname,
                eventId: res.eventId,
                link: res.link
            }
        })
            .subscribe(this.onSuccessBooking.bind(this, currentDay, hour),
                this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onSuccessBooking (day, hour, item): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Slot booked'
        }));
        this._page.timetable.push(new TimetableModel({
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
        if (timetable.user.userId !== this._authService.authUser.userId && !this._authService.staffPermissions.canBookRadioForOthers) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Error',
                message: 'You do not have permission to unbook someone elses slot'
            }));
            return;
        }

        this._dialogService.openConfirmDialog(
            `Sure you wanna unbook?`,
            `Are you sure you wanna unbook ${timetable.user.nickname}'s slot?`,
            () => {
                this._dialogService.closeDialog();
                this._httpService.delete(`staff/${this._type}/timetable/${timetable.timetableId}`)
                    .subscribe(() => {
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Slot unbooked'
                        }));
                        this._page.timetable = this._page.timetable.filter(item => item.timetableId !== timetable.timetableId);
                    });
            }
        );
    }

    private onDayChange (params): void {
        this.tabs = TimeHelper.DAYS.map(day => new TitleTab({
            title: day.abbr,
            value: day.number,
            isActive: Number(params['day']) === day.number
        })).reverse();
    }

    private getTimetableByHour (hour: number): TimetableModel {
        const currentDay = this.getCurrentDay();
        return this._page.timetable
            .filter(timetable => timetable.day === currentDay)
            .find(timetable => timetable.hour === hour);
    }

    private onData (data: { data: TimetablePage }): void {
        this._page = data.data;
        this._page.timetable.forEach(booking => {
            const convertedHour = booking.hour + TimeHelper.getTimeOffsetInHours();
            booking.day = this.getDay(convertedHour, booking.day);
            booking.hour = this.getHour(convertedHour);
        });
    }

    private getDay (convertedHour: number, day: number): number {
        if (convertedHour > 23) {
            return day === 7 ? 1 : day + 1;
        } else if (convertedHour < 0) {
            return day === 1 ? 7 : day - 1;
        }
        return day;
    }

    private getHour (convertedHour: number): number {
        if (convertedHour > 23) {
            return convertedHour - 24;
        } else if (convertedHour < 0) {
            return convertedHour + 24;
        }
        return convertedHour;
    }

    private getCurrentDay (): number {
        return Number(this.tabs.find(tab => tab.isActive).value);
    }
}
