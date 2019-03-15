import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
import {
    Action, ColumnSize,
    FilterConfig,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-table',
    templateUrl: 'table.component.html',
    styleUrls: ['table.component.css']
})

export class TableComponent {
    private _config: TableConfig;
    private _columnSize: ColumnSize = { column: '', actions: '' };

    @Output() onAction: EventEmitter<Action> = new EventEmitter();
    @Output() onFilter: EventEmitter<QueryParameters> = new EventEmitter();
    @Output() onTabClick: EventEmitter<string | number> = new EventEmitter();
    @Input() tabs: Array<TitleTab> = [];
    @Input() isContracted: boolean;

    tabClick(val: string | number): void {
        this.onTabClick.emit(val);
    }

    onChange(row: TableRow, item): void {
        this.onAction.emit(new Action({
            rowId: row.id,
            value: item.target.value
        }));
        item.target.value = null;
    }

    onActionClick(rowId: string, value: number): void {
        this.onAction.emit(new Action({
            rowId: rowId,
            value: value
        }));
    }

    onFilterChange(): void {
        const params: QueryParameters = this.filterConfigs.reduce((prev, curr) => {
            prev[curr.key] = curr.value;
            return prev;
        }, {});
        this.onFilter.emit(params);
    }

    @Input()
    set config(config: TableConfig) {
        this._config = config;
        this._columnSize = this.getColumnSize();
    }

    get columnSize(): ColumnSize {
        return this._columnSize;
    }

    get topBorder(): TitleTopBorder {
        return this._config.topBorder;
    }

    get isSet(): boolean {
        return Boolean(this._config);
    }

    get title(): string {
        return this._config.title;
    }

    get headers(): Array<TableHeader> {
        return this._config.headers;
    }

    get rows(): Array<TableRow> {
        return this._config.rows;
    }

    get haveActions(): boolean {
        return this._config.rows.some(item => item.actions.length > 0);
    }

    get filterConfigs(): Array<FilterConfig> {
        return this._config.filterConfigs;
    }

    private getColumnSize(): ColumnSize {
        switch (this._config.headers.length) {
            case 1:
                return {
                    column: this.haveActions ? 'small-9 medium-10' : 'small-12',
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
            case 4:
            default:
                return {
                    column: this.haveActions ? 'small-2' : 'small-3',
                    actions: this.haveActions ? 'small-2' : ''
                };
        }
    }
}
