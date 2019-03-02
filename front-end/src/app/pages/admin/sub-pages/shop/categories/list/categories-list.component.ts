import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { CategoriesListActions, CategoriesListPage } from './categories-list.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import {
    Action, FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_CATEGORIES_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../../admin.constants';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-admin-shop-categories-list',
    templateUrl: 'categories-list.component.html'
})
export class CategoriesListComponent extends Page implements OnDestroy {
    private _page: CategoriesListPage;
    private _filterTimer = null;
    private _filter: QueryParameters;
    private _actions = [
        new TableAction({ title: 'Edit', value: CategoriesListActions.EDIT }),
        new TableAction({ title: 'Delete', value: CategoriesListActions.DELETE })
    ];

    tableConfig: TableConfig;
    pagination: PaginationModel;
    tabs = [
        new TitleTab({ title: 'Create New', link: '/admin/shop/categories/new' })
    ];

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService,
        private _dialogService: DialogService,
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: SHOP_CATEGORIES_BREADCRUMB_ITEM.title,
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    onFilter(filter: QueryParameters): void {
        clearTimeout(this._filterTimer);

        this._filterTimer = setTimeout(() => {
            this._httpService.get('admin/shop/categories/page/1', filter)
                .subscribe(data => {
                    this._filter = filter;
                    this.onPage({ data: new CategoriesListPage(data) });
                });
        }, 200);
    }

    onAction(action: Action): void {
        switch (action.value) {
            case CategoriesListActions.EDIT:
                this._router.navigateByUrl(`/admin/shop/categories/${action.rowId}`);
                break;
            case CategoriesListActions.DELETE:
                this.onDelete(Number(action.rowId));
                break;

        }
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    private onDelete(shopCategoryId: number): void {
        this._dialogService.openConfirmDialog(
            'Are you sure?',
            'Are you sure you wanna delete this category?',
            () => {
                this._httpService.delete(`admin/shop/categories/${shopCategoryId}`)
                    .subscribe(() => {
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'You have deleted the category'
                        }));
                        this._page.items = this._page.items.filter(item => item.shopCategoryId !== shopCategoryId);
                        this.createOrUpdateTable();
                        this._dialogService.closeDialog();
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
            }
        );
    }

    private onPage(data: { data: CategoriesListPage }): void {
        this._page = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._page.page,
            total: this._page.total,
            url: '/admin/shop/categories/page/:page',
            params: this._filter
        });
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Shop Categories',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [new FilterConfig({
                title: 'Title',
                key: 'filter'
            })]
        });
    }

    private getTableRows(): Array<TableRow> {
        return this._page.items.map(item => new TableRow({
            id: String(item.shopCategoryId),
            cells: [
                new TableCell({ title: item.title }),
                new TableCell({ title: item.description }),
                new TableCell({ title: String(item.displayOrder) })
            ],
            actions: this._actions,
        }));
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Title' }),
            new TableHeader({ title: 'Description' }),
            new TableHeader({ title: 'Display Order' })
        ];
    }
}
