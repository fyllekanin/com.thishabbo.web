import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import {
    Action,
    FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { AutoBansActions, AutoBansListPage } from './auto-bans.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { AutoBansService } from '../../services/auto-bans.service';
import { TitleTab } from 'shared/app-views/title/title.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../../admin.constants';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-admin-auto-bans-list',
    templateUrl: 'auto-bans-list.component.html'
})
export class AutoBansListComponent extends Page implements OnDestroy {
    private _data: AutoBansListPage;
    private _filterTimer = null;
    private _filter: QueryParameters;

    tableConfig: TableConfig;
    pagination: PaginationModel;

    tabs: Array<TitleTab> = [
        new TitleTab({
            title: 'Create New',
            link: 'admin/moderation/auto-bans/new'
        })
    ];

    constructor (
        private _service: AutoBansService,
        private _router: Router,
        private _dialogService: DialogService,
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Automatic Bans List',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onFilter (filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._service.getData(filter, 1)
                .subscribe(data => {
                    this.onData({data: data});
                });
        }, 200);
    }

    onAction (action: Action): void {
        switch (action.value) {
            case AutoBansActions.EDIT:
                this._router.navigateByUrl(`/admin/moderation/auto-bans/${action.rowId}`);
                break;
            case AutoBansActions.DELETE:
                const title = this._data.items.find(item => item.autoBanId === Number(action.rowId)).title;
                this._dialogService.confirm({
                    title: `Are you sure?`,
                    content: `Are you sure you wanna delete ${title}?`,
                    callback: () => {
                        this._httpService.delete(`admin/moderation/auto-bans/${action.rowId}`)
                            .subscribe(() => {
                                this._notificationService.sendNotification(new NotificationMessage({
                                    title: 'Success',
                                    message: 'Autoban deleted'
                                }));
                                this._dialogService.closeDialog();
                                this._data.items = this._data.items.filter(item => item.autoBanId !== Number(action.rowId));
                                this.buildTableConfig();
                            }, this._notificationService.failureNotification.bind(this._notificationService));
                    }
                });
        }
    }

    private onData (data: { data: AutoBansListPage }): void {
        this._data = data.data;
        this.buildTableConfig();

        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: `/admin/moderation/auto-bans/page/:page`,
            params: this._filter
        });
    }

    private buildTableConfig (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Automatic Bans',
            headers: AutoBansListComponent.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [new FilterConfig({
                title: 'Filter',
                placeholder: 'Search for automatic bans',
                key: 'filter'
            })]
        });
    }

    private getTableRows (): Array<TableRow> {
        const actions = [
            new TableAction({title: 'Edit', value: AutoBansActions.EDIT}),
            new TableAction({title: 'Delete', value: AutoBansActions.DELETE})
        ];

        return this._data.items.map(item => {
            return new TableRow({
                id: String(item.autoBanId),
                cells: [
                    new TableCell({title: item.title}),
                    new TableCell({title: String(item.amount)}),
                    new TableCell({title: AutoBansListComponent.getAmountOfDays(item.banLength)})
                ],
                actions: actions
            });
        });
    }

    private static getAmountOfDays (length: number): string {
        const hour = 3600;
        const day = hour * 24;

        if (length < day) {
            return `${length / hour} Hour(s)`;
        }
        return `${length / day} Day(s)`;
    }

    private static getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Title'}),
            new TableHeader({title: 'Amount'}),
            new TableHeader({title: 'Ban Length'})
        ];
    }
}
