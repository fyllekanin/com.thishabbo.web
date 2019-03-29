import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';
import { LOG_TYPES, LogPage } from './logs.model';
import { FilterConfig, TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';
import { StringHelper } from 'shared/helpers/string.helper';
import { TimeHelper } from 'shared/helpers/time.helper';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { QueryParameters } from 'core/services/http/http.model';
import { HttpService } from 'core/services/http/http.service';

@Component({
    selector: 'app-admin-moderation-logs',
    templateUrl: 'logs.component.html',
    styleUrls: ['logs.component.css']
})
export class LogsComponent extends Page implements OnDestroy {
    private _data: LogPage = null;
    private _filterTimer = null;
    private _filter: QueryParameters;

    logType = null;
    tableConfig: TableConfig;
    pagination: PaginationModel;
    options: Array<{ value: string, label: string }> = [];

    constructor(
        private _httpService: HttpService,
        private _router: Router,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.logType = activatedRoute.snapshot.params['type'];
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Logs',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
        this.options = Object.keys(LOG_TYPES).map(key => {
            return { value: LOG_TYPES[key], label: StringHelper.firstCharUpperCase(LOG_TYPES[key]) };
        });
    }

    ngOnDestroy() {
        super.destroy();
    }

    onTypeChange(): void {
        this._router.navigateByUrl(`/admin/moderation/logs/${this.logType}/page/1`);
    }

    onFilter(filter: QueryParameters): void {
        clearTimeout(this._filterTimer);

        this._filterTimer = setTimeout(() => {
            this._httpService.get(`admin/logs/${this.logType}/page/1`, filter)
                .subscribe(res => {
                    this.onData({ data: new LogPage(res) });
                });
        }, 200);
    }

    private onData(data: { data: LogPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: `/admin/moderation/logs/${this.logType}/page/:page`,
            params: this._filter
        });
    }

    private createOrUpdateTable(): void {
        this.tableConfig = new TableConfig({
            title: `${StringHelper.firstCharUpperCase(this.logType)} log`,
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [new FilterConfig({
                title: 'User',
                placeholder: 'Search for specific user',
                key: 'filter'
            })]
        });
    }

    private getTableRows(): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            cells: [
                new TableCell({ title: item.user.nickname }),
                new TableCell({ title: item.action }),
                new TableCell({ title: TimeHelper.getTime(item.createdAt) })
            ],
            isExpandable: Boolean(item.data),
            dataTitle: 'Extra data in the log:',
            data: Boolean(item.data) ? this.getDataHTML(item.data) : ''
        }));
    }

    private getDataHTML(data: object): string {
        let html = '';
        Object.keys(data).forEach(key => {
            html += `<strong>${key}:</strong> ${data[key]} <br />`;
        });
        return html;
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'User' }),
            new TableHeader({ title: 'Action' }),
            new TableHeader({ title: 'When' })
        ];
    }
}
