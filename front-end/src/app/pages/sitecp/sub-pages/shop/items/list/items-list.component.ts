import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_ITEMS_BREADCRUMB_ITEMS, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { ShopListPage } from './list.model';
import { TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { SHOP_ITEM_RARITIES, SHOP_ITEM_TYPES } from '../../shop.helper';

@Component({
    selector: 'app-sitecp-shop-items-list',
    templateUrl: 'items-list.component.html'
})
export class ItemsListComponent extends Page implements OnDestroy {
    private _data: ShopListPage;

    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor (
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
            rows: this.getTableRows()
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
