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
    private _permShow: PermShow = new PermShow();
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
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
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
            case PermShowActions.CANCEL:
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
        const convertedHour = TimeHelper.getConvertedHour(this._permShow.hour - TimeHelper.getTimeOffsetInHours());
        const convertedDay = TimeHelper.getConvertedDay(convertedHour, this._permShow.day);
        const booking = {
            day: convertedDay,
            hour: convertedHour,
            nickname: this._permShow.nickname,
            timetableId: this._permShow.timetableId,
            name: this._permShow.name,
            description: this._permShow.description,
            createdAt: this._permShow.createdAt,
            type: this._permShow.type
        };

        if (this._permShow.createdAt) {
            this._httpService.put(`staff/management/permanent-shows/${this._permShow.timetableId}`,
                {booking: booking})
                .subscribe(this.onSuccessUpdate.bind(this, this._permShow),
                    this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._httpService.post('staff/management/permanent-shows', {booking: booking})
                .subscribe(this.onSuccessCreate.bind(this, this._permShow),
                    this._notificationService.failureNotification.bind(this._notificationService));
        }
    }

    private delete (): void {
        this._dialogService.openConfirmDialog(
            `Deleting permanent show`,
            `Are you sure that you wanna delete this? You can just pause it this week by unbooking it`,
            this.onDelete.bind(this, this._permShow.timetableId)
        );
    }

    private cancel (): void {
        this._router.navigateByUrl('/staff/management/permanent-shows/page/1');
    }

    get title (): string {
        return this._permShow.createdAt ?
            `Editing Permanent Show: ${this._permShow.name}` :
            `Creating Permanent Show: ${this._permShow.name}`;
    }

    get perm (): PermShow {
        return this._permShow;
    }

    private onDelete (permShowId: number): void {
        this._httpService.delete(`staff/management/permanent-shows/${permShowId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Perm show deleted!'
                }));
                this._router.navigateByUrl('/staff/management/permanent-shows/page/1');
            }, this._notificationService.failureNotification.bind(this._notificationService), () => {
                this._dialogService.closeDialog();
            });
    }

    private onSuccessCreate (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Permanent show created!'
        }));
    }

    private onSuccessUpdate (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Permanent show updated!'
        }));
    }

    private onPage (data: { data: PermShow }): void {
        this._permShow = data.data;
        this._permShow.hour = TimeHelper.getConvertedHour(this._permShow.hour + TimeHelper.getTimeOffsetInHours());
        this._permShow.day = TimeHelper.getConvertedDay(this._permShow.hour, this._permShow.day);

        const tabs = [
            {title: 'Save', value: PermShowActions.SAVE, condition: true},
            {title: 'Delete', value: PermShowActions.DELETE, condition: this._permShow.createdAt},
            {title: 'Cancel', value: PermShowActions.CANCEL, condition: true}
        ];

        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
