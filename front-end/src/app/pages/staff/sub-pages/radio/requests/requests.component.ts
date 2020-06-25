import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { STAFFCP_BREADCRUM_ITEM, STAFFCP_RADIO_BREADCRUM_ITEM } from '../../../staff.constants';
import { RequestAction, RequestModel, RequestsPage } from './requests.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { map } from 'rxjs/operators';
import { DialogService } from 'core/services/dialog/dialog.service';

@Component({
    selector: 'app-staff-radio-requests',
    templateUrl: 'requests.component.html',
    styleUrls: [ 'requests.component.css' ]
})
export class RequestsComponent extends Page implements OnDestroy {
    private _data: RequestsPage = new RequestsPage(null);

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Reload', value: 0 }),
        new TitleTab({ title: 'Delete All', value: 1 })
    ];

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
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

    onReload (): void {
        this._httpService.get('staff/radio/requests')
            .pipe(map(res => new RequestsPage(res)))
            .subscribe(page => {
                this.onData({ data: page });
            });
    }

    onDelete (item: RequestModel): void {
        this._httpService.delete(`staff/radio/requests/${item.requestId}`)
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Request deleted');
                this._data.items = this._data.items.filter(request => request.requestId !== item.requestId);
                this.checkTabs();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    onDeleteAll (): void {
        this._dialogService.confirm({
            title: 'Are you sure?',
            content: 'Are you sure you wanna delete all radio requests?',
            callback: () => {
                this._dialogService.closeDialog();
                this._httpService.delete(`staff/radio/requests`)
                    .subscribe(() => {
                        this._notificationService.sendInfoNotification('Requests deleted');
                        this._data.items = [];
                        this.checkTabs();
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }

    onAction (value: number): void {
        switch (value) {
            case RequestAction.RELOAD:
                this.onReload();
                break;
            case RequestAction.DELETE_ALL:
                this.onDeleteAll();
                break;
        }
    }

    get requests (): Array<RequestModel> {
        return this._data.items;
    }

    get canDeleteRequests (): boolean {
        return this._data.canDeleteRequests;
    }

    private onData (data: { data: RequestsPage }): void {
        this._data = data.data;
        this.checkTabs();
    }

    private checkTabs (): void {
        this.tabs = [
            { title: 'Reload', value: RequestAction.RELOAD, condition: true },
            {
                title: 'Delete All',
                value: RequestAction.DELETE_ALL,
                condition: this.canDeleteRequests && this._data.items.length > 0
            }
        ].filter(item => item.condition)
            .map(item => new TitleTab(item));
    }
}
