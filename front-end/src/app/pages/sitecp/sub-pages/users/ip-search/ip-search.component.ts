import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, USER_LIST_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { HttpService } from 'core/services/http/http.service';
import {
    FILTER_TYPE_CONFIG,
    FilterConfig,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { IpSearchModel } from './ip-search.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-sitecp-ip-search',
    templateUrl: 'ip-search.component.html'
})
export class IpSearchComponent extends Page implements OnDestroy {
    private _data: Array<IpSearchModel> = [];
    private _filterTimer = null;
    private _filter: QueryParameters;

    tableConfig: TableConfig;

    constructor (
        private _httpService: HttpService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'IP Search',
            items: [
                SITECP_BREADCRUMB_ITEM,
                USER_LIST_BREADCRUMB_ITEM
            ]
        });
        this.createOrUpdateTable();
    }

    ngOnDestroy (): void {
        this.destroy();
    }

    onFilter (queryParameters: QueryParameters): void {
        this._filter = queryParameters;
        clearTimeout(this._filterTimer);
        this._filterTimer = setTimeout(() => {
            this._httpService.get('sitecp/users/ip-search', this._filter)
                .subscribe(data => {
                    this._data = data.map(res => new IpSearchModel(res));
                    this.createOrUpdateTable();
                });
        }, 200);
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Result',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [
                new FilterConfig({
                    title: 'Nickname',
                    placeholder: 'Search by nickname...',
                    key: 'nickname'
                }),
                FILTER_TYPE_CONFIG,
                new FilterConfig({
                    title: 'IP',
                    key: 'ip',
                    placeholder: 'Search by ip....'
                })
            ]
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.map(item => {
            return new TableRow({
                cells: [
                    new TableCell({ title: item.nickname }),
                    new TableCell({ title: item.ip }),
                    new TableCell({ title: TimeHelper.getLongDateWithTime(item.createdAt) })
                ]
            });
        });
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Nickname' }),
            new TableHeader({ title: 'IP' }),
            new TableHeader({ title: 'Date' })
        ];
    }
}
