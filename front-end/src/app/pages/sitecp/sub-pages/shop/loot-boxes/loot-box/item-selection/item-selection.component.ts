import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { HttpService } from 'core/services/http/http.service';
import { LootBoxItem, LootBoxItemsPage } from '../loot-box.model';
import {
    FILTER_TYPE_CONFIG,
    FilterConfig,
    FilterConfigItem,
    FilterConfigType,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { ShopHelper } from 'shared/helpers/shop.helper';
import { CONFIGURABLE_ITEMS, SHOP_ITEM_RARITIES, SHOP_ITEM_TYPES } from 'shared/constants/shop.constants';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-sitecp-shop-loot-box-item',
    templateUrl: 'item-selection.component.html'
})
export class ItemSelectionComponent extends InnerDialogComponent {
    private _selectedItems: Array<LootBoxItem> = [];
    private _itemIds: Array<number> = [];
    private _data: LootBoxItemsPage;
    private _filterTimer;
    private _filter: QueryParameters;

    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor (private _httpService: HttpService) {
        super();
    }

    setData (itemIds: Array<number>) {
        this._itemIds = itemIds;
        this.fetchItems(1);
    }

    getData (): Array<LootBoxItem> {
        return this._selectedItems;
    }

    onPageSwitch (page: number): void {
        this.fetchItems(page);
    }

    onRowToggle (row: TableRow): void {
        const shopItem = this._data.items.find(item => item.shopItemId === Number(row.id));
        if (!shopItem) {
            return;
        }

        if (row.isSelected && this._selectedItems.findIndex(item => item.shopItemId === shopItem.shopItemId) === -1) {
            this._selectedItems.push(shopItem);
        } else if (!row.isSelected && this._selectedItems.findIndex(item => item.shopItemId === shopItem.shopItemId) > -1) {
            this._selectedItems = this._selectedItems.filter(item => item.shopItemId !== shopItem.shopItemId);
        }
    }

    onFilter (params: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = params;
        this._filterTimer = setTimeout(() => {
            this.fetchItems(1);
        }, 200);
    }

    private fetchItems (page: number): void {
        this._filter = (this._filter || {});
        this._filter.itemIds = this._itemIds.toString();

        this._httpService.get(`sitecp/shop/loot-boxes/items/page/${page}`, this._filter)
            .subscribe(res => {
                this._data = new LootBoxItemsPage(res);
                this.createOrUpdateTable();
                this.createPagination();
            });
    }

    private createPagination (): void {
        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            isSlim: true,
            rows: this.getTableRows(),
            headers: this.getTableHeaders(),
            isRowsSelectable: true,
            filterConfigs: [
                new FilterConfig({
                    type: FilterConfigType.TEXT,
                    title: 'Title',
                    key: 'title',
                    placeholder: 'Filter by title..'
                }),
                FILTER_TYPE_CONFIG,
                new FilterConfig({
                    type: FilterConfigType.SELECT,
                    title: 'Type',
                    key: 'type',
                    items: CONFIGURABLE_ITEMS.map(item => new FilterConfigItem({
                        label: item.label,
                        value: item.value.toString()
                    }))
                }),
                new FilterConfig({
                    type: FilterConfigType.SELECT,
                    title: 'Rarity',
                    key: 'rarity',
                    items: Object.keys(SHOP_ITEM_RARITIES).map(key => {
                        return new FilterConfigItem({
                            label: SHOP_ITEM_RARITIES[key].label,
                            value: SHOP_ITEM_RARITIES[key].value
                        });
                    })
                })
            ]
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            id: String(item.shopItemId),
            cells: [
                new TableCell({ title: this.getResource(item), innerHTML: true }),
                new TableCell({ title: item.title }),
                new TableCell({ title: ShopHelper.getTypeName(item.type) }),
                new TableCell({ title: ShopHelper.getRarityName(item.rarity) })
            ],
            isSelected: this._selectedItems
                .findIndex(selectedItem => selectedItem.shopItemId === item.shopItemId) > -1
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Resource' }),
            new TableHeader({ title: 'Title' }),
            new TableHeader({ title: 'Type' }),
            new TableHeader({ title: 'Rarity' })
        ];
    }

    private getResource (item: LootBoxItem): string {
        switch (item.type) {
            case SHOP_ITEM_TYPES.nameIcon.value:
            case SHOP_ITEM_TYPES.nameEffect.value:
                return `<img src="/resources/images/shop/${item.shopItemId}.gif" />`;
            case SHOP_ITEM_TYPES.subscription.value:
                return '<em class="fas fa-id-card"></em>';
            case SHOP_ITEM_TYPES.badge.value:
                return `<img src="/resources/images/badges/${item.data.badgeId}.gif" />`;
            default:
                return '';
        }
    }
}
