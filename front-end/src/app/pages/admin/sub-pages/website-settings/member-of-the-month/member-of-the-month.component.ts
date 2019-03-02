import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { MemberOfTheMonthModel } from './member-of-the-month.model';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, WEBSITE_SETTINGS_BREADCRUMB_ITEM } from '../../../admin.constants';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-admin-content-member-of-the-month',
    templateUrl: 'member-of-the-month.component.html'
})
export class MemberOfTheMonthComponent extends Page implements OnDestroy {
    private _data = new MemberOfTheMonthModel();

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor(
        private _globalNotificationService: GlobalNotificationService,
        private _httpService: HttpService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Member of the Month',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    get model(): MemberOfTheMonthModel {
        return this._data;
    }

    get months(): Array<string> {
        return TimeHelper.FULL_MONTHS;
    }

    onSave(): void {
        this._httpService.put('admin/content/member-of-the-month', { information: this._data })
            .subscribe(this.onSuccessUpdate.bind(this, this),
                this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onSuccessUpdate (): void {
        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
            title: 'Success',
            message: 'Member of the month updated!'
        }));
    }

    private onData(data: { data: MemberOfTheMonthModel }): void {
        this._data = data.data;
    }
}
