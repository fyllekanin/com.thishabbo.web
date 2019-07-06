import { Component, OnInit } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { HttpService } from 'core/services/http/http.service';
import { SelectableBadges } from './select-badge.model';
import {
    FILTER_TYPE_CONFIG,
    FilterConfig,
    FilterConfigType,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-sitecp-shop-item-select-badge',
    templateUrl: 'select-badge.component.html'
})
export class SelectBadgeComponent extends InnerDialogComponent implements OnInit {
    private _data: SelectableBadges;
    private _badgeId: number;
    private _filterTimer;
    private _filter: QueryParameters;

    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor (private _httpService: HttpService) {
        super();
    }

    ngOnInit (): void {
        this.fetchItems(1);
    }

    getData () {
        return this._badgeId;
    }

    setData () {
    }

    onPageSwitch (page: number): void {
        this.fetchItems(page);
    }

    onRowToggle (): void {
        const selected = this.tableConfig.rows.find(row => row.isSelected);
        if (selected) {
            this._badgeId = Number(selected.id);
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
        this._httpService.get(`sitecp/shop/items/badges/page/${page}`, this._filter)
            .subscribe(res => {
                this._data = new SelectableBadges(res);
                this.createOrUpdateTable();
                this.pagination = new PaginationModel({
                    total: this._data.total,
                    page: this._data.page
                });
            });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            isSlim: true,
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [
                new FilterConfig({
                    type: FilterConfigType.TEXT,
                    title: 'Title',
                    key: 'filter',
                    placeholder: 'Filter by name..'
                }),
                FILTER_TYPE_CONFIG
            ],
            isRowsSelectable: true,
            maxSelections: 1
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            id: String(item.badgeId),
            cells: [
                new TableCell({title: item.getResource(), innerHTML: true}),
                new TableCell({title: item.name}),
                new TableCell({title: String(item.points)})
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Resource'}),
            new TableHeader({title: 'Name'}),
            new TableHeader({title: 'Points'})
        ];
    }
}
