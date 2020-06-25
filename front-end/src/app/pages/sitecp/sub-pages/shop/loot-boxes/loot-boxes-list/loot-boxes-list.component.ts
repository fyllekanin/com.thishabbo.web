import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_LOOT_BOXES_BREADCRUMB_ITEMS, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { LootBoxesListActions, LootBoxesListPage } from './loot-boxes-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import {
    Action,
    FILTER_TYPE_CONFIG,
    FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { LootBoxesListService } from '../../services/loot-boxes-list.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-sitecp-shop-loot-boxes-list',
    templateUrl: 'loot-boxes-list.component.html'
})
export class LootBoxesListComponent extends Page implements OnDestroy {
    private _data: LootBoxesListPage;
    private _filterTimer;
    private _filter: QueryParameters;

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Create New', link: '/sitecp/shop/loot-boxes/new' })
    ];
    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor (
        private _router: Router,
        private _dialogService: DialogService,
        private _service: LootBoxesListService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: SHOP_LOOT_BOXES_BREADCRUMB_ITEMS.title,
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    onFilter (params: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = params;
        this._filterTimer = setTimeout(() => {
            this._service.getPage(1, this._filter).subscribe(res => {
                this.onData({ data: res });
            });
        }, 200);
    }

    ngOnDestroy () {
        super.destroy();
    }

    onAction (action: Action): void {
        switch (action.value) {
            case LootBoxesListActions.EDIT:
                this._router.navigateByUrl(`/sitecp/shop/loot-boxes/${action.rowId}`);
                break;
            case LootBoxesListActions.DELETE:
                this._dialogService.confirm({
                    title: 'Are you sure?',
                    content: 'Are you sure you wanna delete this loot box?',
                    callback: () => {
                        this._service.delete(action.rowId).subscribe(() => {
                            this._notificationService.sendInfoNotification('Loot box deleted');
                            this._data.items = this._data.items.filter(item => item.lootBoxId !== Number(action.rowId));
                            this.createOrUpdateTable();
                            this._dialogService.closeDialog();
                        }, this._notificationService.failureNotification.bind(this._notificationService));
                    }
                });
                break;
        }
    }

    private onData (data: { data: LootBoxesListPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/sitecp/shop/loot-boxes/page/:page',
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Loot Boxes',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [
                new FilterConfig({
                    title: 'Filter',
                    placeholder: 'Search by title...',
                    key: 'filter'
                }),
                FILTER_TYPE_CONFIG
            ]
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            id: String(item.lootBoxId),
            cells: [
                new TableCell({ title: item.title }),
                new TableCell({ title: String(item.items) })
            ],
            actions: [
                new TableAction({ title: 'Edit', value: LootBoxesListActions.EDIT }),
                new TableAction({ title: 'Delete', value: LootBoxesListActions.DELETE })
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Title' }),
            new TableHeader({ title: 'Items' })
        ];
    }
}
