import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
import {
    Action,
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
}
