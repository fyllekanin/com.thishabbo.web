import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { CategoryModel, CategoryModelActions } from './category.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_CATEGORIES_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../../admin.constants';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-admin-shop-category',
    templateUrl: 'category.component.html'
})
export class CategoryComponent extends Page implements OnDestroy {
    private _data: CategoryModel;

    tabs: Array<TitleTab> = [];

    constructor(
        private _dialogService: DialogService,
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService,
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Shop Category',
            items: [
                SITECP_BREADCRUMB_ITEM,
                SHOP_CATEGORIES_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onTabClick(action: number): void {
        switch (action) {
            case CategoryModelActions.SAVE:
                this.onSave();
                break;
            case CategoryModelActions.DELETE:
                this.onDelete();
                break;
            case CategoryModelActions.CANCEL:
                this._router.navigateByUrl('/admin/shop/categories/page/1');
                break;
        }
    }

    get title(): string {
        return (this._data.createdAt ? 'Updating:' : 'Creating:') + ` ${this._data.title}`;
    }

    get model(): CategoryModel {
        return this._data;
    }

    private onSave(): void {
        if (this._data.createdAt) {
            this._httpService.put(`admin/shop/categories/${this._data.shopCategoryId}`, { category: this._data })
                .subscribe(res => {
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Success',
                        message: 'Shop category updated'
                    }));
                    this.onData({ data: new CategoryModel(res) });
                }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
        } else {
            this._httpService.post(`admin/shop/categories`, { category: this._data })
                .subscribe(res => {
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Success',
                        message: 'Shop category created'
                    }));
                    this.onData({ data: new CategoryModel(res) });
                }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
        }
    }

    private onDelete(): void {
        this._dialogService.openConfirmDialog(
            'Are you sure?',
            'Are you sure you wanna delete this shop category?',
            () => {
                this._httpService.delete(`admin/shop/categories/${this._data.shopCategoryId}`)
                    .subscribe(() => {
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'Shop category deleted'
                        }));
                        this._dialogService.closeDialog();
                        this._router.navigateByUrl('/admin/shop/categories/page/1');
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
            }
        );
    }

    private onData(data: { data: CategoryModel }): void {
        this._data = data.data;

        this.tabs = [
            { title: 'Cancel', value: CategoryModelActions.CANCEL, condition: true },
            { title: 'Delete', value: CategoryModelActions.DELETE, condition: this._data.createdAt },
            { title: 'Save', value: CategoryModelActions.SAVE, condition: true }
        ].filter(item => item.condition).map(item => new TitleTab(item));
    }
}
