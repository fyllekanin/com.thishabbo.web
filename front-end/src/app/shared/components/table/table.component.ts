import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
import {
    Action,
    ColumnSize,
    FilterConfig,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { QueryParameters } from 'core/services/http/http.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-table',
    templateUrl: 'table.component.html',
    styleUrls: ['table.component.css']
})

export class TableComponent implements DoCheck {
    private _config: TableConfig;
    private _columnSize: ColumnSize = {column: '', actions: ''};

    @Output() onAction: EventEmitter<Action> = new EventEmitter();
    @Output() onFilter: EventEmitter<QueryParameters> = new EventEmitter();
    @Output() onTabClick: EventEmitter<string | number> = new EventEmitter();
    @Output() onRowToggle: EventEmitter<TableRow> = new EventEmitter();
    @Input() tabs: Array<TitleTab> = [];
    @Input() isContracted: boolean;

    constructor (private _router: Router) {
    }

    tabClick (val: string | number): void {
        this.onTabClick.emit(val);
    }

    onChange (row: TableRow, item): void {
        this.onAction.emit(new Action({
            rowId: row.id,
            value: item.target.value
        }));
        item.target.value = null;
    }

    onActionClick (rowId: string, value: number): void {
        this.onAction.emit(new Action({
            rowId: rowId,
            value: value
        }));
    }

    onFilterChange (): void {
        const params: QueryParameters = this.filterConfigs.reduce((prev, curr) => {
            prev[curr.key] = curr.value;
            return prev;
        }, {});
        this.updateStateOfUrl();
        this.onFilter.emit(params);
    }

    ngDoCheck (): void {
        if (this._columnSize !== this.getColumnSize()) {
            this._columnSize = this.getColumnSize();
        }
    }

    onRowSelect (row: TableRow): void {
        this.onRowToggle.emit(row);
    }

    @Input()
    set config (config: TableConfig) {
        this._config = config;
        this._columnSize = this.getColumnSize();
    }

    get isSlim (): boolean {
        return this._config.isSlim;
    }

    get topBorder (): TitleTopBorder {
        return this._config.topBorder;
    }

    get isSet (): boolean {
        return Boolean(this._config);
    }

    get title (): string {
        return this._config.title;
    }

    get headers (): Array<TableHeader> {
        return this._config.headers;
    }

    get rows (): Array<TableRow> {
        return this._config.rows;
    }

    get haveActions (): boolean {
        return this._config.rows.some(item => item.actions.length > 0);
    }

    get filterConfigs (): Array<FilterConfig> {
        return this._config.filterConfigs;
    }

    get isRowsSelectable (): boolean {
        return this._config.isRowsSelectable;
    }

    private getColumnSize (): ColumnSize {
        if (!this._config || !this._config.headers) {
            return null;
        }
        switch (this._config.headers.length) {
            case 1:
                return {
                    column: 'small-11',
                    actions: this.haveActions ? 'small-3 medium-2' : ''
                };
            case 2:
                return {
                    column: this.haveActions ? 'small-4 medium-5' : 'small-6',
                    actions: this.haveActions ? 'small-4 medium-2' : ''
                };
            case 3:
                return {
                    column: this.haveActions ? 'small-3' : 'small-4',
                    actions: this.haveActions ? 'small-3' : ''
                };
            case 5:
                return {
                    column: 'small-2',
                    actions: 'small-2'
                };
            case 4:
            default:
                return {
                    column: this.haveActions ? 'small-2' : 'small-3',
                    actions: this.haveActions ? 'small-2' : ''
                };
        }
    }

    private updateStateOfUrl (): void {
        const newPath = location.pathname.replace(new RegExp(/\/page\/[0-9]+/g), '/page/1');
        const setParams = this.filterConfigs.filter(item => item.value).reduce((prev, curr) => {
            prev[curr.key] = curr.value;
            return prev;
        }, {});
        this._router.navigateByUrl(this._router.createUrlTree([newPath], {
            queryParams: setParams,
            skipLocationChange: true
        }));
    }
}
