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
import { TimetableModel, TimetablePage } from 'shared/models/timetable.model';
import { TimetableHelper } from 'shared/helpers/timetable.helper';

@Component({
    selector: 'app-staff-timetable',
    templateUrl: 'timetable.component.html',
    styleUrls: [ 'timetable.component.css' ]
})
export class TimetableComponent extends Page implements OnDestroy {
    private readonly _type;
    private _data: TimetablePage = new TimetablePage();
    private _timezones: Array<string> = [];

    tabs: Array<TitleTab> = [];
    isEvents: boolean;

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
        this.isEvents = this._type === 'events';
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
        const linkIcon = this.isEvents ? (timetable.link ? '<i class="far fa-thumbs-up"></i>' :
            '<i class="far fa-thumbs-down"></i>') : '';
        const name = this.getEventName(timetable);
        const postFix = `<br /> ${name ? '(' + name + ')' : ''} ${linkIcon}`;
        return `${timetable.user.nickname}${postFix}`;
    }

    clickHour (hour: number): void {
        const timetable = this.getTimetableByHour(hour);
        if (!timetable) {
            this.book(hour);
            return;
        }

        if ((this.isEvents && this._authService.staffPermissions.canBookEventForOthers) ||
            (!this.isEvents && this._authService.staffPermissions.canBookRadioForOthers)) {
            this.editBooking(timetable);
        } else {
            this.unbook(timetable);
        }
    }

    isCurrentSlot (hour: number): boolean {
        return TimetableHelper.isCurrentSlot(this.getCurrentDay(), hour);
    }

    get timezones (): Array<string> {
        return this._timezones;
    }

    private getEventName (timetable: TimetableModel): string {
        return TimetableHelper.getEventName(timetable, this.isEvents);
    }

    private editBooking (timetableModel: TimetableModel): void {
        this._dialogService.openDialog({
            title: `Edit slot: ${TimeHelper.getHours()[timetableModel.hour].label}`,
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Unbook',
                    callback: () => {
                        this.unbook(timetableModel);
                    }
                }),
                new DialogButton({
                    title: 'Save',
                    callback: (res: { nickname: string, eventId: number, link: string }) => {
                        this._httpService.put(`staff/${this._type}/timetable/${timetableModel.timetableId}`, {
                            data: {
                                nickname: res ? res.nickname : null,
                                eventId: res ? res.eventId : null,
                                link: res ? res.link : null
                            }
                        }).subscribe(response => {
                            this.onSuccessEdit(timetableModel, new TimetableModel(response));
                        }, this._notificationService.failureNotification.bind(this._notificationService));
                    }
                })
            ],
            component: this._componentFactory.resolveComponentFactory(SelectionComponent),
            data: {
                events: this._data.events,
                canBookRadioForOther: this.canBookRadioForOther(),
                canBookEventForOther: this.canBookEventForOther(),
                isEvents: this.isEvents,
                slot: timetableModel
            }
        });
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
            component: this.isEvents || this.canBookRadioForOther() ?
                this._componentFactory.resolveComponentFactory(SelectionComponent) : null,
            content: 'Are you sure you want to book this slot?',
            data: {
                events: this._data.events,
                canBookRadioForOther: this.canBookRadioForOther(),
                canBookEventForOther: this.canBookEventForOther(),
                isEvents: this.isEvents
            }
        });
    }

    private canBookEventForOther (): boolean {
        return this._authService.staffPermissions.canBookEventForOthers;
    }

    private canBookRadioForOther (): boolean {
        return this._authService.staffPermissions.canBookRadioForOthers;
    }

    private onBook (hour: number, res: { nickname: string, eventId: number, link: string }): void {
        const currentDay = this.getCurrentDay();

        const offsetInHours = hour + TimeHelper.getHourOffsetRounded();
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

    private onSuccessEdit (timetableModel: TimetableModel, item: TimetableModel): void {
        this._notificationService.sendInfoNotification('Slot edited!');
        const timetableItem = this._data.timetable.find(slot => slot.timetableId === timetableModel.timetableId);
        timetableItem.link = item.link;
        timetableItem.event = item.event;
        timetableItem.user = item.user;
        this._dialogService.closeDialog();
    }

    private onSuccessBooking (day, hour, item): void {
        this._notificationService.sendInfoNotification('Slot booked');
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
        const permission = this.isEvents ? this._authService.staffPermissions.canBookEventForOthers :
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
