import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, BETTING_CATEGORIES_BREADCRUMB_ITEM } from '../../../../admin.constants';
import { BetCategoryActions, BetCategoryModel } from '../categories.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-admin-betting-category',
    templateUrl: 'category.component.html'
})
export class CategoryComponent extends Page implements OnDestroy {
    private _data: BetCategoryModel;

    tabs: Array<TitleTab> = [];

    constructor(
        private _globalNotificationService: GlobalNotificationService,
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Betting category',
            items: [
                SITECP_BREADCRUMB_ITEM,
                BETTING_CATEGORIES_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onTabClick(value: number): void {
        switch (value) {
            case BetCategoryActions.SAVE:
                this.onSave();
                break;
            case BetCategoryActions.CANCEL:
                this._router.navigateByUrl('/admin/betting/categories/page/1');
                break;
            case BetCategoryActions.DELETE:
                this.onDelete();
                break;
        }
    }

    get model(): BetCategoryModel {
        return this._data;
    }

    get title(): string {
        return this._data.createdAt ?
            `Editing Betting Category: ${this._data.name}` :
            `Creating Betting Category: ${this._data.name || ''}`;
    }

    private onSave(): void {
        if (this._data.createdAt) {
            this._httpService.put(`admin/betting/category/${this._data.betCategoryId}`, { betCategory: this._data })
                .subscribe(res => {
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Success',
                        message: `${this._data.name} updated!`
                    }));
                    this.onData({ data: new BetCategoryModel(res) });
                }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
        } else {
            this._httpService.post(`admin/betting/category`, { betCategory: this._data })
                .subscribe(res => {
                    this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                        title: 'Success',
                        message: `${this._data.name} created!`
                    }));
                    this.onData({ data: new BetCategoryModel(res) });
                }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
        }
    }

    private onDelete(): void {
        this._dialogService.openConfirmDialog(
            `Deleting ${this._data.name}`,
            `Are you sure you wanna delete ${this._data.name}?`,
            this.doDelete.bind(this)
        );
    }

    private doDelete(): void {
        this._httpService.delete(`admin/betting/category/${this._data.betCategoryId}`)
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: `${this._data.name} is deleted`
                }));
                this._router.navigateByUrl('/admin/betting/categories/page/1');
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onData(data: { data: BetCategoryModel }): void {
        this._data = data.data;

        const tabs = [
            { title: 'Save', value: BetCategoryActions.SAVE, condition: true },
            { title: 'Delete', value: BetCategoryActions.DELETE, condition: this._data.createdAt },
            { title: 'Cancel', value: BetCategoryActions.CANCEL, condition: true }
        ];
        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
