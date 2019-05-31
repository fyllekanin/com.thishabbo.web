import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { StaffOfTheWeekActions, StaffOfTheWeekModel } from './staff-of-the-week.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, WEBSITE_SETTINGS_BREADCRUMB_ITEM } from '../../../admin.constants';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-admin-content-staff-of-the-week',
    templateUrl: 'staff-of-the-week.component.html'
})
export class StaffOfTheWeekComponent extends Page implements OnDestroy {
    private _data = new StaffOfTheWeekModel();

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Save', value: StaffOfTheWeekActions.SAVE}),
        new TitleTab({title: 'Back', value: StaffOfTheWeekActions.BACK})
    ];

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _router: Router,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Staff of the Week',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    get model (): StaffOfTheWeekModel {
        return this._data;
    }

    get months (): Array<string> {
        return TimeHelper.FULL_MONTHS;
    }

    onTabClick (action: number): void {
        switch (action) {
            case StaffOfTheWeekActions.SAVE:
                this._httpService.put('admin/content/staff-of-the-week', {information: this._data})
                    .subscribe(this.onSuccessUpdate.bind(this, this),
                        this._notificationService.failureNotification.bind(this._notificationService));
                break;
            case StaffOfTheWeekActions.BACK:
                this._router.navigateByUrl('/admin/website-settings');
                break;
        }
    }

    private onSuccessUpdate (): void {
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Staff of the Week updated!'
        }));
    }

    private onData (data: { data: StaffOfTheWeekModel }): void {
        this._data = data.data;
    }
}
