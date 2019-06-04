import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { isAbsent } from 'shared/helpers/class.helper';
import { Page } from 'shared/page/page.model';
import { CATEGORY_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';
import { Category, CategoryActions, CategoryLeaf, CategoryOptions, CategoryPage } from './category.model';

@Component({
    selector: 'app-admin-forum-category',
    templateUrl: 'category.component.html'
})
export class CategoryComponent extends Page implements OnDestroy {
    private _categoryPage: CategoryPage = new CategoryPage();

    tabs: Array<TitleTab> = [];
    categories: Array<CategoryLeaf> = [];

    constructor (
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _router: Router,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Category',
            items: [
                SITECP_BREADCRUMB_ITEM,
                CATEGORY_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    onTabClick (value: number): void {
        switch (value) {
            case CategoryActions.SAVE:
                this.save();
                break;
            case CategoryActions.DELETE:
                this.delete();
                break;
            case CategoryActions.BACK:
                this.cancel();
                break;
        }
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private save (): void {
        if (this._categoryPage.category.createdAt) {
            this._httpService.put(`admin/categories/${this._categoryPage.category.categoryId}`, {category: this._categoryPage.category})
                .subscribe(res => {
                    this.onSuccessUpdate(res);
                }, error => {
                    this._notificationService.failureNotification(error);
                });
        } else {
            this._httpService.post('admin/categories', {category: this._categoryPage.category})
                .subscribe(res => {
                    this.onSuccessCreate(res);
                }, error => {
                    this._notificationService.failureNotification(error);
                });
        }
    }

    private delete (): void {
        this._dialogService.confirm({
            title: `Deleting category`,
            content: `Are you sure that you want to delete the category ${this._categoryPage.category.title}? <br />
                <li>All threads & posts will be deleted</li>
                <li>All Sub categories will be without parent</li>`,
            callback: this.onDelete.bind(this)
        });
    }

    private cancel (): void {
        this._router.navigateByUrl('/admin/forum/categories/page/1');
    }

    get category (): Category {
        return this._categoryPage.category;
    }

    get parentId (): number {
        return this._categoryPage.category.parentId || -1;
    }

    set parentId (parentId: number) {
        this._categoryPage.category.parentId = parentId;
    }

    get title (): string {
        return this._categoryPage.category.createdAt ?
            `Editing Category: ${this._categoryPage.category.title}` :
            `Creating Category: ${this._categoryPage.category.title}`;
    }

    get template (): string {
        return this._categoryPage.category.template || 'DEFAULT';
    }

    set template (template: string) {
        this._categoryPage.category.template = template;
    }

    get options (): CategoryOptions {
        return this._categoryPage.category.options || new CategoryOptions();
    }

    private flat (array: Array<CategoryLeaf>, prefix = '', shouldAppend = true) {
        let result = [];
        (array || []).forEach((item: CategoryLeaf) => {
            item.title = `${prefix} ${item.title}`;
            result.push(item);
            if (Array.isArray(item.children)) {
                result = result.concat(this.flat(item.children, shouldAppend ? `${prefix}--` : ''));
            }
        });
        return result;
    }

    private onDelete (): void {
        this._httpService.delete(`admin/categories/${this._categoryPage.category.categoryId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Category Deleted!'
                }));
                this._router.navigateByUrl('/admin/forum/categories/page/1');
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private onSuccessCreate (category: CategoryPage): void {
        this.onPage({data: new CategoryPage(category)});
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Category Created!'
        }));
    }

    private onSuccessUpdate (category: CategoryPage): void {
        this.onPage({data: new CategoryPage(category)});
        this._notificationService.sendNotification(new NotificationMessage({
            title: 'Success',
            message: 'Category Updated!'
        }));
    }

    private onPage (data: { data: CategoryPage }): void {
        this._categoryPage = data.data;
        if (isAbsent(this._categoryPage.category)) {
            this._categoryPage.category = new Category;
        }

        const tabs = [
            {title: 'Save', value: CategoryActions.SAVE, condition: true},
            {title: 'Delete', value: CategoryActions.DELETE, condition: this._categoryPage.category.createdAt},
            {title: 'Back', value: CategoryActions.BACK, condition: true}
        ];

        this.categories = this.flat(this._categoryPage.forumTree, '');
        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
