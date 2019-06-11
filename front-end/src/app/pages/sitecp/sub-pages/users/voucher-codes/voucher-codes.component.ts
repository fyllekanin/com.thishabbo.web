import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { VoucherCode, VoucherCodesPage } from './voucher-codes.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, USER_LIST_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import {
    Action,
    FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { VoucherCodeComponent } from './voucher-code/voucher-code.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-sitecp-users-voucher-codes',
    templateUrl: 'voucher-codes.component.html'
})
export class VoucherCodesComponent extends Page implements OnDestroy {
    private _data = new VoucherCodesPage({});
    private _filterTimer = null;
    private _filter: QueryParameters;
    private _actions: Array<TableAction> = [
        new TableAction({title: 'Delete'})
    ];

    tableConfig: TableConfig;
    pagination: PaginationModel;
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Create New'})
    ];

    constructor (
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _componentResolver: ComponentFactoryResolver,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Voucher Codes',
            items: [
                SITECP_BREADCRUMB_ITEM,
                USER_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onFilter (filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._httpService.get(`sitecp/voucher-codes/page/1`, filter)
                .subscribe(data => {
                    this.onData({data: new VoucherCodesPage(data)});
                });
        }, 200);
    }

    onCreateNew (): void {
        this._dialogService.openDialog({
            title: 'Voucher Code',
            component: this._componentResolver.resolveComponentFactory(VoucherCodeComponent),
            buttons: [
                new DialogCloseButton('Cancel'),
                new DialogButton({title: 'Create', callback: this.onCreateCode.bind(this)})
            ]
        });
    }

    onDelete (action: Action): void {
        this._dialogService.confirm({
            title: 'Are you sure?',
            content: 'Are you sure you wanna delete this voucher code?',
            callback: () => {
                this._httpService.delete(`sitecp/voucher-codes/${action.rowId}`)
                    .subscribe(() => {
                        this._data.items = this._data.items.filter(item => item.voucherCodeId !== Number(action.rowId));
                        this.createOrUpdateTable();
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Voucher code deleted!'
                        }));
                        this._dialogService.closeDialog();
                    }, this._notificationService.failureNotification.bind(this));
            }
        });
    }

    private onCreateCode (data: { note: string, value: number }): void {
        if (!data.note) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Failure',
                message: 'Note can not be empty',
                type: NotificationType.ERROR
            }));
            return;
        }

        this._httpService.post('sitecp/voucher-codes', {note: data.note, value: data.value})
            .subscribe(res => {
                this._data.items.push(new VoucherCode(res));
                this._dialogService.closeDialog();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Code created!'
                }));
                this.createOrUpdateTable();
            }, this._notificationService.failureNotification.bind(this));
    }

    private onData (data: { data: VoucherCodesPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();
        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/sitecp/users/voucher-codes/page/:page',
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Voucher Codes',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [
                new FilterConfig({
                    title: 'Filter',
                    placeholder: 'Filter by note...',
                    key: 'filter'
                })
            ]
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            id: String(item.voucherCodeId),
            cells: [
                new TableCell({title: item.code}),
                new TableCell({title: item.note}),
                new TableCell({title: item.claimer ? `Claimed by: ${item.claimer.nickname}` : 'Not Claimed'}),
                new TableCell({title: String(item.value)})
            ],
            actions: this._actions
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Code'}),
            new TableHeader({title: 'Note'}),
            new TableHeader({title: 'Status'}),
            new TableHeader({title: 'Value'})
        ];
    }
}
