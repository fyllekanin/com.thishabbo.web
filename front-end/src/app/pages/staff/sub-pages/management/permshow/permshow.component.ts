import { Component, ElementRef, OnDestroy } from '@angular/core';
import { PermShow, PermShowActions } from './permshow.model';
import { Page } from 'shared/page/page.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import {
    STAFFCP_BREADCRUM_ITEM,
    STAFFCP_MANAGEMENT_BREADCRUMB_ITEM,
    STAFFCP_PERM_SHOW_BREADCRUM_ITEM
} from 'app/pages/staff/staff.constants';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Day, Hour, TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-staff-management-permshow',
    templateUrl: './permshow.component.html'
})
export class PermShowComponent extends Page implements OnDestroy {
    private _data: PermShow = new PermShow();
    tabs: Array<TitleTab> = [];
    days: Array<Day> = TimeHelper.DAYS;
    hours: Array<Hour> = TimeHelper.getHours();

    constructor (
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _router: Router,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Permanent Show',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                STAFFCP_MANAGEMENT_BREADCRUMB_ITEM,
                STAFFCP_PERM_SHOW_BREADCRUM_ITEM
            ]
        });
    }

    onTabClick (value: number): void {
        switch (value) {
            case PermShowActions.SAVE:
                this.save();
                break;
            case PermShowActions.BACK:
                this.cancel();
                break;
            case PermShowActions.DELETE:
                this.delete();
                break;
        }
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private save (): void {
        const offsetInHours = this._data.hour + (new Date().getTimezoneOffset() / 60);
        const convertedHour = TimeHelper.getConvertedHour(offsetInHours);
        const convertedDay = TimeHelper.getConvertedDay(offsetInHours, this._data.day);

        const booking = {
            day: convertedDay,
            hour: convertedHour,
            nickname: this._data.nickname,
            timetableId: this._data.timetableId,
            name: this._data.name,
            description: this._data.description,
            createdAt: this._data.createdAt,
            type: this._data.type,
            link: this._data.link
        };

        if (this._data.createdAt) {
            this._httpService.put(`staff/management/permanent-shows/${this._data.timetableId}`,
                { booking: booking })
                .subscribe(() => {
                        this.onSuccessUpdate();
                    },
                    error => {
                        this._notificationService.failureNotification(error);
                    });
        } else {
            this._httpService.post('staff/management/permanent-shows', { booking: booking })
                .subscribe(() => {
                        this.onSuccessCreate();
                    },
                    error => {
                        this._notificationService.failureNotification(error);
                    });
        }
    }

    private delete (): void {
        this._dialogService.confirm({
            title: `Delete Permanent Show`,
            content: `Are you sure that you want to delete this perm show? If they are missing this week,
             you can just unbook it and it'll automatically book next week!`,
            callback: this.onDelete.bind(this, this._data.timetableId)
        });
    }

    private cancel (): void {
        this._router.navigateByUrl('/staff/management/permanent-shows/page/1');
    }

    get title (): string {
        return this._data.createdAt ?
            `Editing Permanent Show: ${this._data.name}` :
            `Creating Permanent Show: ${this._data.name}`;
    }

    get perm (): PermShow {
        return this._data;
    }

    private onDelete (permShowId: number): void {
        this._httpService.delete(`staff/management/permanent-shows/${permShowId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Permanent show deleted!'
                }));
                this._router.navigateByUrl('/staff/management/permanent-shows/page/1');
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private onSuccessCreate (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Permanent show created!'
        }));
        this._data.createdAt = new Date().getTime() / 1000;
        this.setTabs();
    }

    private onSuccessUpdate (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Permanent show updated!'
        }));
    }

    private onData (data: { data: PermShow }): void {
        this._data = data.data;
        this._data.hour = TimeHelper.getConvertedHour(this._data.hour + TimeHelper.getTimeOffsetInHours());
        this._data.day = TimeHelper.getConvertedDay(this._data.hour, this._data.day);

        this.setTabs();
    }

    private setTabs (): void {
        const tabs = [
            { title: 'Save', value: PermShowActions.SAVE, condition: true },
            { title: 'Back', value: PermShowActions.BACK, condition: true },
            { title: 'Delete', value: PermShowActions.DELETE, condition: this._data.createdAt }
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
