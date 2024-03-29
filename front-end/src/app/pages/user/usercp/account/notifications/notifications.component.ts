import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { NotificationsPage } from './notifications.model';
import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { HttpService } from 'core/services/http/http.service';

@Component({
    selector: 'app-usercp-account-notifications',
    templateUrl: 'notifications.component.html',
    styleUrls: [ 'notifications.component.css' ]
})
export class NotificationsComponent extends Page implements OnDestroy {
    private _data: NotificationsPage;

    pagination: PaginationModel;

    constructor (
        private _continuesInformationService: ContinuesInformationService,
        private _httpService: HttpService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Notifications',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onRead (notification: NotificationModel<any>): void {
        this._httpService.put(`puller/notifications/read/${notification.notificationId}`)
            .subscribe(() => {
                notification.isRead = true;
                this._continuesInformationService.removeNotification(notification.notificationId);
            });
    }

    get notifications (): Array<NotificationModel<any>> {
        return this._data.items;
    }

    private onData (data: { data: NotificationsPage }): void {
        this._data = data.data;

        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/user/usercp/account/notifications/page/:page'
        });
    }
}
