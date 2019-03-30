import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, USER_LIST_BREADCRUMB_ITEM } from '../../../admin.constants';
import { ActivatedRoute } from '@angular/router';
import { ThcRequestActions, ThcRequestModel } from './thc-requests.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { ThcRequestsService } from '../services/thc-requests.service';

@Component({
    selector: 'app-admin-user-thc-requests',
    templateUrl: 'thc-requests.component.html'
})
export class ThcRequestsComponent extends Page implements OnDestroy {
    private _data: Array<ThcRequestModel> = [];

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Approve All' })
    ];
    tableConfig: TableConfig;

    constructor(
        private _globalNotificationService: GlobalNotificationService,
        private _service: ThcRequestsService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Thc Requests',
            items: [
                SITECP_BREADCRUMB_ITEM,
                USER_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    approveAll(): void {
        const requests = this._data.map(item => {
            return { requestThcId: item.requestThcId, isApproved: true };
        });
        this.updateRequests(requests, true);
    }

    onAction(action: Action): void {
        switch (action.value) {
            case ThcRequestActions.APPROVE_REQUEST:
                this.updateRequests([{ requestThcId: Number(action.rowId), isApproved: true }], false);
                break;
            case ThcRequestActions.DENY_REQUEST:
                this.updateRequests([{ requestThcId: Number(action.rowId), isApproved: false }], false);
                break;
        }
    }

    private updateRequests(requests: Array<{ requestThcId: number, isApproved: boolean }>, isBatch: boolean): void {
        this._service.updateRequests(requests).subscribe(() => {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Success',
                message: isBatch ? 'All requests approved!' : 'Request done'
            }));
            this._data = isBatch ? [] : this._data.filter(item => item.requestThcId === requests[0].requestThcId);
            this.createOrUpdateTable();
        });
    }

    private onData(data: { data: Array<ThcRequestModel> }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'THC Requests',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows(): Array<TableRow> {
        const actions = [
            new TableAction({ title: 'Approve', value: ThcRequestActions.APPROVE_REQUEST }),
            new TableAction({ title: 'Deny', value: ThcRequestActions.DENY_REQUEST })
        ];
        return this._data.map(item => new TableRow({
            id: String(item.requestThcId),
            cells: [
                new TableCell({ title: item.requester.nickname }),
                new TableCell({ title: item.amount.toString() }),
                new TableCell({ title: item.reason }),
                new TableCell({ title: item.receiver.nickname })
            ],
            actions: actions
        }));
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Requester' }),
            new TableHeader({ title: 'Amount' }),
            new TableHeader({ title: 'Reason' }),
            new TableHeader({ title: 'Receiver' })
        ];
    }
}
