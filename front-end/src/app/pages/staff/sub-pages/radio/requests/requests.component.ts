import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { STAFFCP_BREADCRUM_ITEM, STAFFCP_RADIO_BREADCRUM_ITEM } from '../../../staff.constants';
import { RequestModel, RequestsPage } from './requests.model';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-staff-radio-requests',
    templateUrl: 'requests.component.html'
})
export class RequestsComponent extends Page implements OnDestroy {
    private _data: RequestsPage = new RequestsPage(null);

    reload: Array<TitleTab> = [
        new TitleTab({title: 'Reload'})
    ];
    tabs: Array<TitleTab> = [];
    infoModel: InfoBoxModel = {
        title: 'Hey!',
        type: INFO_BOX_TYPE.INFO,
        content: `You currently do not have any requests, tell your listeners to request!`
    };

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Requests',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                STAFFCP_RADIO_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    getTitle (item: RequestModel): string {
        const ip = item.ip ? ` (ip: ${item.ip})` : '';
        return `Request ${ip}`;
    }

    onReload (): void {
        this._httpService.get('staff/radio/requests')
            .pipe(map(res => new RequestsPage(res)))
            .subscribe(page => {
                this.onData({data: page});
            });
    }

    onDelete (item: RequestModel): void {
        this._httpService.delete(`staff/radio/requests/${item.requestId}`)
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Request deleted');
                this._data.items = this._data.items.filter(request => request.requestId !== item.requestId);
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    get requests (): Array<RequestModel> {
        return this._data.items;
    }

    private onData (data: { data: RequestsPage }): void {
        this._data = data.data;
        this.setTabs();
    }

    private setTabs (): void {
        if (this._data.canDeleteRequests) {
            this.tabs = [
                new TitleTab({title: 'Delete'})
            ];
        }
    }
}
