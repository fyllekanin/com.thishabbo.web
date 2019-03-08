import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, USER_LIST_BREADCRUMB_ITEM } from '../../../admin.constants';
import { HttpService } from 'core/services/http/http.service';
import { TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';
import { IpSearchModel } from './ip-search.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-admin-ip-search',
    templateUrl: 'ip-search.component.html'
})
export class IpSearchComponent extends Page implements OnDestroy {
    private _data: Array<IpSearchModel> = [];
    private _filterTimer = null;

    tableConfig: TableConfig;
    ipAddress: string;
    nickname: string;

    constructor(
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
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    onFilter(): void {
        clearTimeout(this._filterTimer);
        this._filterTimer = setTimeout(() => {
            this._httpService.get('admin/users/ip-search', { nickname: this.nickname, ipAddress: this.ipAddress })
                .subscribe(data => {
                    this._data = data.map(res => new IpSearchModel(res));
                    this.createOrUpdateTable();
                });
        }, 200);
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Result',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows(): Array<TableRow> {
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

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Nickname' }),
            new TableHeader({ title: 'IP' }),
            new TableHeader({ title: 'Date' })
        ];
    }
}
