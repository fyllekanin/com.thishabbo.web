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
import { CATEGORY_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { Category, CategoryActions, CategoryLeaf, CategoryOptions, CategoryPage } from './category.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { SelectItem } from 'shared/components/form/select/select.model';

@Component({
    selector: 'app-sitecp-forum-category',
    templateUrl: 'category.component.html',
    styleUrls: ['category.component.css']
})
export class CategoryComponent extends Page implements OnDestroy {
    private _categoryPage: CategoryPage = new CategoryPage();

    tabs: Array<TitleTab> = [];
    categories: Array<CategoryLeaf> = [];
    selectedCategory: SelectItem;
    selectableCategories: Array<SelectItem> = [];

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
                this.save(false);
                break;
            case CategoryActions.SAVE_AND_CASCADE:
                this._dialogService.confirm({
                    title: 'Are you sure?',
                    content: 'Are you sure you wanna cascade all these options to sub-categories?',
                    callback: () => {
                        this._dialogService.closeDialog();
                        this.save(true);
                    }
                });
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

    get category (): Category {
        return this._categoryPage.category;
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

    private save (isCascade: boolean): void {
        this._categoryPage.category.parentId = this.selectedCategory.value;
        if (this._categoryPage.category.createdAt) {
            this._httpService.put(`sitecp/categories/${this._categoryPage.category.categoryId}`, {
                category: this._categoryPage.category,
                isCascade: isCascade
            })
                .subscribe(res => {
                    this.onSuccessUpdate(res);
                }, error => {
                    this._notificationService.failureNotification(error);
                });
        } else {
            this._httpService.post('sitecp/categories', {category: this._categoryPage.category})
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
        this._router.navigateByUrl('/sitecp/forum/categories/page/1');
    }

    private flat (array: Array<CategoryLeaf>, prefix = '', shouldAppend = true) {
        let result = [];
        array.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'displayOrder'));
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
        this._httpService.delete(`sitecp/categories/${this._categoryPage.category.categoryId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Category Deleted!'
                }));
                this._router.navigateByUrl('/sitecp/forum/categories/page/1');
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

        this.setTabs();
        this.setSelectItems();
        this.categories = this.flat(this._categoryPage.forumTree, '');

        const selected = this.selectableCategories.find(item => item.value === this._categoryPage.category.parentId);
        this.selectedCategory = selected || this.selectableCategories[0];
    }

    private setSelectItems (): void {
        this.selectableCategories = [{
            label: 'None',
            value: -1
        }].concat(this.flat(this._categoryPage.forumTree, '').map(item => ({
            label: item.title,
            value: item.categoryId
        })));
    }

    private setTabs (): void {
        const tabs = [
            {title: 'Save', value: CategoryActions.SAVE, condition: true},
            {
                title: 'Save & Cascade Options',
                value: CategoryActions.SAVE_AND_CASCADE,
                condition: this._categoryPage.category.createdAt
            },
            {title: 'Back', value: CategoryActions.BACK, condition: true},
            {title: 'Delete', value: CategoryActions.DELETE, condition: this._categoryPage.category.createdAt}
        ];
        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
