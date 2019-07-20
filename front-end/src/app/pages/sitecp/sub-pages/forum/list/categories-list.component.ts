import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'core/services/auth/auth.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { Page } from 'shared/page/page.model';
import { CATEGORY_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { CategoryListActions, ListCategory } from './categories-list.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-sitecp-categories-list',
    templateUrl: 'categories-list.component.html'
})

export class CategoriesListComponent extends Page implements OnDestroy {
    private _categories: Array<ListCategory> = [];
    private _tableConfigs: Array<TableConfig> = [];
    private _permissionAction = new TableAction({
        title: 'Edit Forum Permissions',
        value: CategoryListActions.EDIT_PERMISSIONS
    });
    private _actions: Array<TableAction> = [
        new TableAction({title: 'Edit Category', value: CategoryListActions.EDIT_CATEGORY}),
        new TableAction({title: 'Group Tree', value: CategoryListActions.GROUP_TREE}),
        new TableAction({title: 'Delete Category', value: CategoryListActions.DELETE_CATEGORY})
    ];

    mainTabs: Array<TitleTab> = [
        new TitleTab({title: 'Toggle', value: CategoryListActions.TOGGLE_CATEGORY}),
        new TitleTab({title: 'Save Order', value: CategoryListActions.SAVE_ORDER}),
        new TitleTab({title: 'New Category', link: '/sitecp/forum/categories/new'})
    ];
    contractTabs: Array<TitleTab> = [
        new TitleTab({title: 'Toggle', value: CategoryListActions.TOGGLE_CATEGORY})
    ];

    constructor (
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        private _httpService: HttpService,
        private _router: Router,
        private _authService: AuthService,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: CATEGORY_LIST_BREADCRUMB_ITEM.title,
            items: [SITECP_BREADCRUMB_ITEM]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    getTableConfigFor (item: ListCategory) {
        return this._tableConfigs.find(config => config.id === item.categoryId);
    }

    onSaveOrder (): void {
        const data = this._tableConfigs.reduce((prev, curr) => {
            return prev.concat(curr.rows);
        }, []).map(row => {
            const cell = row.cells.find(c => c.title === 'displayOrder');
            return {categoryId: row.id, order: cell.value};
        });
        this.updateCategoryDisplayOrder(data);
    }

    onTabClick (action, categoryId: number): void {
        switch (action) {
            case CategoryListActions.SAVE_ORDER:
                this.onSaveOrder();
                break;
            case CategoryListActions.TOGGLE_CATEGORY:
                this.toggleCategory(categoryId);
                break;
        }
    }

    onAction (action: Action): void {
        switch (action.value) {
            case CategoryListActions.EDIT_PERMISSIONS:
                this._router.navigateByUrl(`/sitecp/forum/categories/${action.rowId}/permissions/0`);
                break;
            case CategoryListActions.EDIT_CATEGORY:
                this._router.navigateByUrl(`/sitecp/forum/categories/${action.rowId}`);
                break;
            case CategoryListActions.GROUP_TREE:
                this._router.navigateByUrl(`/sitecp/forum/categories/${action.rowId}/groups`);
                break;
            case CategoryListActions.DELETE_CATEGORY:
                this._dialogService.confirm({
                    title: `Deleting category`,
                    content: `Are you sure that you want to delete the category? <br />
                        <li>All threads & posts will be deleted</li>
                        <li>All Sub categories will be without parent</li>`,
                    callback: this.onDelete.bind(this, Number(action.rowId))
                });
                break;
        }
    }

    isCategoryContracted (categoryId: number): boolean {
        const items = this.getContractedCategories();
        return items.indexOf(categoryId) > -1;
    }

    get mainCategories (): Array<ListCategory> {
        return this._categories;
    }

    private updateCategoryDisplayOrder (data): void {
        this._httpService.put(`sitecp/categories/orders/update`, {updates: data})
            .subscribe(res => {
                const categories = res.map(item => new ListCategory(item));
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Orders updated!'
                }));
                this.onPage({data: categories});
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private getTableConfig (item: ListCategory) {
        return new TableConfig({
            id: item.categoryId,
            title: item.title,
            headers: this.getTableHeaders(),
            rows: this.getTableRows(item)
        });
    }

    private onDelete (categoryId: number): void {
        this._httpService.delete(`sitecp/categories/${categoryId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Category deleted!'
                }));

                const categories = ArrayHelper.flatCategories(this._categories, '', false);
                const parent = categories.find(category => {
                    const ids = category.children.map(child => child.categoryId);
                    return ids.indexOf(categoryId) > -1;
                });

                if (parent) {
                    parent.children = parent.children.filter(child => child.categoryId !== categoryId);
                } else {
                    this._categories = this._categories.filter(category => category.categoryId !== categoryId);
                }
                this.onPage({data: this._categories});
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private onPage (data: { data: Array<ListCategory> }): void {
        this._categories = data.data;
        this._categories.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'displayOrder'));
        this.buildTableConfigs();
    }

    private buildTableConfigs (): void {
        const categories = ArrayHelper.copyArray(this._categories);
        categories.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'displayOrder'));
        this._tableConfigs = categories.map(this.getTableConfig.bind(this));
    }

    private getTableRows (item: ListCategory): Array<TableRow> {
        const actions = [].concat(this._actions);

        if (this._authService.sitecpPermissions.canManageForumPermissions) {
            actions.splice(1, 0, this._permissionAction);
        }

        const main = new TableRow({
            id: String(item.categoryId),
            cells: [
                new TableCell({title: item.title}),
                new TableCell({
                    title: item.isHidden ? 'Hidden' : 'Visible'
                }),
                new TableCell({
                    title: 'displayOrder',
                    isEditable: true,
                    value: item.displayOrder.toString()
                })],
            actions: actions
        });

        const childRows = ArrayHelper.flatCategories(item.children, '--').map(category => {
            return new TableRow({
                id: category.categoryId,
                cells: [
                    new TableCell({
                        title: (category.isFirstChild ? `<strong>${category.title}</strong>` : category.title),
                        innerHTML: true
                    }),
                    new TableCell({
                        title: category.isHidden ? 'Hidden' : 'Visible'
                    }),
                    new TableCell({
                        title: 'displayOrder',
                        isEditable: true,
                        value: category.displayOrder.toString()
                    })
                ],
                actions: actions
            });
        });

        return [main].concat(childRows);
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Category', width: '20rem'}),
            new TableHeader({title: 'Hidden', width: '5rem'}),
            new TableHeader({title: 'Display Order', width: '10rem'})
        ];
    }

    private toggleCategory (categoryId: number): void {
        let items = this.getContractedCategories();
        if (items.indexOf(categoryId) === -1) {
            items.push(categoryId);
        } else {
            items = items.filter(item => item !== categoryId);
        }
        localStorage.setItem(LOCAL_STORAGE.CONTRACTED_SITECP_CATEGORIES, JSON.stringify(items));
    }

    private getContractedCategories (): Array<number> {
        const stored = localStorage.getItem(LOCAL_STORAGE.CONTRACTED_SITECP_CATEGORIES);
        return stored ? JSON.parse(stored).map(item => Number(item)) : [];
    }
}
