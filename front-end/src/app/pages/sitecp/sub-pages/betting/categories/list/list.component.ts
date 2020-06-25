import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import {
    Action,
    FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { BetCategoryActions, BetCategoryModel, CategoriesListPage } from '../categories.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-sitecp-betting-categories-list',
    templateUrl: 'list.component.html'
})
export class ListComponent extends Page implements OnDestroy {
    private _data: CategoriesListPage;
    private _filterTimer;
    private _filter: QueryParameters;

    tableConfig: TableConfig;
    pagination: PaginationModel;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Create Category', link: '/sitecp/betting/categories/new' })
    ];

    constructor (
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _router: Router,
        private _httpService: HttpService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Betting Categories',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    onFilter (filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._httpService.get(`sitecp/betting/categories/1`, filter)
                .subscribe(res => {
                    this.onData({ data: new CategoriesListPage(res) });
                });
        }, 200);
    }

    onAction (action: Action): void {
        const row = this.tableConfig.rows.find(item => item.id === action.rowId);
        const model = this._data.betCategories.find(category => category.betCategoryId === Number(row.id));
        switch (action.value) {
            case BetCategoryActions.EDIT_CATEGORY:
                this._router.navigateByUrl(`/sitecp/betting/categories/${row.id}`);
                break;
            case BetCategoryActions.DELETE_CATEGORY:
                this._dialogService.confirm({
                    title: `Deleting ${model.name}`,
                    content: `Are you sure you want to delete ${model.name}?`,
                    callback: this.doDelete.bind(this, model)
                });
                break;
        }
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private doDelete (model: BetCategoryModel): void {
        this._httpService.delete(`sitecp/betting/category/${model.betCategoryId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `${model.name} is deleted`
                }));
                this._data.betCategories = this._data.betCategories
                    .filter(category => category.betCategoryId !== model.betCategoryId);
                this.createOrUpdateTable();
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private onData (data: { data: CategoriesListPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: `/sitecp/betting/categories/page/:page`,
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Betting Categories',
            headers: ListComponent.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [ new FilterConfig({
                title: 'Search',
                placeholder: 'Filter on Category Name...',
                key: 'filter'
            }) ]
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.betCategories.map(category => {
            return new TableRow({
                id: String(category.betCategoryId),
                cells: [
                    new TableCell({ title: category.name }),
                    new TableCell({ title: category.displayOrder.toString() })
                ],
                actions: [
                    new TableAction({ title: 'Edit', value: BetCategoryActions.EDIT_CATEGORY }),
                    new TableAction({ title: 'Delete', value: BetCategoryActions.DELETE_CATEGORY })
                ]
            });
        });
    }

    private static getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Name' }),
            new TableHeader({ title: 'Display Order' })
        ];
    }
}
