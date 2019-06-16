import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_ITEMS_BREADCRUMB_ITEMS, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { ShopListPage } from './list.model';
import {
    FilterConfig,
    FilterConfigItem,
    FilterConfigType,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { SHOP_ITEM_RARITIES, SHOP_ITEM_TYPES } from '../../shop.helper';
import { CONFIGURABLE_ITEMS } from 'shared/constants/shop.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { QueryParameters } from 'core/services/http/http.model';
import { ItemsListService } from '../../services/items-list.service';

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

    private onData (data: { data: ShopListPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();
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
                    placeholder: 'Search by title..',
                    key: 'filter'
                }),
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
            new TableHeader({title: 'Title'}),
            new TableHeader({title: 'Type'}),
            new TableHeader({title: 'Rarity'})
        ];
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            id: String(item.shopItemId),
            cells: [
                new TableCell({title: item.title}),
                new TableCell({title: SHOP_ITEM_TYPES.find(type => type.id === item.type).name}),
                new TableCell({title: SHOP_ITEM_RARITIES.find(rarity => rarity.percentage === item.rarity).name})
            ]
        }));
    }
}
