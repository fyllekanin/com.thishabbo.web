import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { LOG_TYPES, LogPage } from './logs.model';
import {
    Action,
    FilterConfig,
    FilterConfigItem,
    FilterConfigType,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { StringHelper } from 'shared/helpers/string.helper';
import { TimeHelper } from 'shared/helpers/time.helper';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { QueryParameters } from 'core/services/http/http.model';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { LogDetailsComponent } from './log-details/log-details.component';
import { DialogCloseButton } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-sitecp-moderation-logs',
    templateUrl: 'logs.component.html'
})
export class LogsComponent extends Page implements OnDestroy {
    private _data: LogPage = null;
    private _filterTimer = null;
    private _filter: QueryParameters;

    logType = null;
    tableConfig: TableConfig;
    pagination: PaginationModel;
    options: Array<{ value: string, label: string }> = [];

    constructor (
        private _httpService: HttpService,
        private _router: Router,
        private _dialogService: DialogService,
        private _componentResolver: ComponentFactoryResolver,
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
            return {value: LOG_TYPES[key], label: StringHelper.firstCharUpperCase(LOG_TYPES[key])};
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onTypeChange (): void {
        this._router.navigateByUrl(`/sitecp/moderation/logs/${this.logType}/page/1`);
    }

    onFilter (filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._httpService.get(`sitecp/logs/${this.logType}/page/1`, filter)
                .subscribe(res => {
                    this.onData({data: new LogPage(res)});
                });
        }, 200);
    }

    onAction (action: Action): void {
        const item = this._data.items.find(item => item.logId === Number(action.rowId));
        this._dialogService.openDialog({
            title: `${item.user.nickname} ${item.action} - Details`,
            component: this._componentResolver.resolveComponentFactory(LogDetailsComponent),
            data: item,
            buttons: [
                new DialogCloseButton('Close')
            ]
        });
    }

    private onData (data: { data: LogPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: `/sitecp/moderation/logs/${this.logType}/page/:page`,
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: `${StringHelper.firstCharUpperCase(this.logType)} log`,
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [
                new FilterConfig({
                    title: 'User',
                    placeholder: 'Search for specific user...',
                    key: 'user'
                }),
                new FilterConfig({
                    title: 'Action',
                    key: 'action',
                    type: FilterConfigType.SELECT,
                    items: this._data.actions.map(action => new FilterConfigItem({
                        label: action.description,
                        value: String(action.id)
                    }))
                })
            ]
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            id: String(item.logId),
            cells: [
                new TableCell({title: item.user.nickname}),
                new TableCell({title: item.action}),
                new TableCell({title: TimeHelper.getTime(item.createdAt)})
            ],
            actions: [
                new TableAction({title: 'View Details'})
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'User'}),
            new TableHeader({title: 'Action'}),
            new TableHeader({title: 'When'})
        ];
    }
}
