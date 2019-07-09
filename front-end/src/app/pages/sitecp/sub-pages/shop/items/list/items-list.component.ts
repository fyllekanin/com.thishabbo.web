import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_ITEMS_BREADCRUMB_ITEMS, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { ShopItemListAction, ShopListPage } from './list.model';
import {
    Action,
    FILTER_TYPE_CONFIG,
    FilterConfig,
    FilterConfigItem,
    FilterConfigType,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { CONFIGURABLE_ITEMS, SHOP_ITEM_TYPES } from 'shared/constants/shop.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { QueryParameters } from 'core/services/http/http.model';
import { ItemsListService } from '../../services/items-list.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { ShopHelper } from 'shared/helpers/shop.helper';

@Component({
    selector: 'app-sitecp-shop-items-list',
    templateUrl: 'items-list.component.html'
})
export class ItemsListComponent extends Page implements OnDestroy {
    private _data: ShopListPage;
    private _filterTimer;
    private _filter: QueryParameters;

    tableConfig: TableConfig;
    pagination: PaginationModel;
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Create New', link: '/sitecp/shop/items/new'})
    ];

    constructor (
        private _service: ItemsListService,
        private _router: Router,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: SHOP_ITEMS_BREADCRUMB_ITEMS.title,
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onFilter (params: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = params;
        this._filterTimer = setTimeout(() => {
            this._service.getPage(1, this._filter).subscribe(res => {
                this.onData({data: res});
            });
        }, 200);
    }

    onAction (action: Action): void {
        switch (action.value) {
            case ShopItemListAction.EDIT:
                this._router.navigateByUrl(`/sitecp/shop/items/${action.rowId}`);
                break;
            case ShopItemListAction.ITEM_USERS:
                this._router.navigateByUrl(`/sitecp/shop/items/${action.rowId}/users`);
                break;
            case ShopItemListAction.DELETE:
                this._dialogService.confirm({
                    title: 'Shop Item Delete',
                    content: 'Are you sure you want to delete this?',
                    callback: () => {
                        this._service.delete(action.rowId).subscribe(() => {
                            this._notificationService.sendInfoNotification('Item deleted');
                            this._data.items = this._data.items.filter(item => item.shopItemId !== Number(action.rowId));
                            this._dialogService.closeDialog();
                        }, this._notificationService.failureNotification.bind(this._notificationService));
                    }
                });
        }
    }

    private onData (data: { data: ShopListPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/sitecp/shop/items/page/:page',
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Shop Items',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [
                new FilterConfig({
                    title: 'Filter',
                    placeholder: 'Search by title...',
                    key: 'filter'
                }),
                FILTER_TYPE_CONFIG,
                new FilterConfig({
                    title: 'Type',
                    key: 'type',
                    type: FilterConfigType.SELECT,
                    items: CONFIGURABLE_ITEMS.map(item => new FilterConfigItem({
                        label: item.label,
                        value: item.value.toString()
                    }))
                })
            ]
        });
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Resource'}),
            new TableHeader({title: 'Title'}),
            new TableHeader({title: 'Type'}),
            new TableHeader({title: 'Rarity'})
        ];
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => {
            const actions = [
                {
                    title: 'Edit',
                    value: ShopItemListAction.EDIT,
                    condition: true
                },
                {
                    title: 'Manage Users',
                    value: ShopItemListAction.ITEM_USERS,
                    condition: [
                        SHOP_ITEM_TYPES.nameIcon.value,
                        SHOP_ITEM_TYPES.nameEffect.value
                    ].indexOf(item.type) > -1
                },
                {
                    title: 'Delete',
                    value: ShopItemListAction.DELETE,
                    condition: true
                }
            ];

            return new TableRow({
                id: String(item.shopItemId),
                cells: [
                    new TableCell({title: item.getResource(), innerHTML: true}),
                    new TableCell({title: item.title}),
                    new TableCell({title: ShopHelper.getTypeName(item.type)}),
                    new TableCell({title: ShopHelper.getRarityName(item.rarity)})
                ],
                actions: actions.filter(action => action.condition)
                    .map(action => new TableAction(action))
            });
        });
    }
}
