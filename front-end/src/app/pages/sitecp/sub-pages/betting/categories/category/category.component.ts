import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BETTING_CATEGORIES_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { BetCategoryActions, BetCategoryModel } from '../categories.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-sitecp-betting-category',
    templateUrl: 'category.component.html'
})
export class CategoryComponent extends Page implements OnDestroy {
    private _data: BetCategoryModel;

    tabs: Array<TitleTab> = [];

    constructor (
        private _notificationService: NotificationService,
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

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (value: number): void {
        switch (value) {
            case BetCategoryActions.SAVE:
                this.onSave();
                break;
            case BetCategoryActions.BACK:
                this._router.navigateByUrl('/sitecp/betting/categories/page/1');
                break;
            case BetCategoryActions.DELETE:
                this.onDelete();
                break;
        }
    }

    get model (): BetCategoryModel {
        return this._data;
    }

    get title (): string {
        return this._data.createdAt ?
            `Editing Betting Category: ${this._data.name}` :
            `Creating Betting Category: ${this._data.name || ''}`;
    }

    private onSave (): void {
        if (this._data.createdAt) {
            this._httpService.put(`sitecp/betting/category/${this._data.betCategoryId}`, {betCategory: this._data})
                .subscribe(res => {
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: `${this._data.name} updated!`
                    }));
                    this.onData({data: new BetCategoryModel(res)});
                }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._httpService.post(`sitecp/betting/category`, {betCategory: this._data})
                .subscribe(res => {
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: `${this._data.name} created!`
                    }));
                    this.onData({data: new BetCategoryModel(res)});
                }, this._notificationService.failureNotification.bind(this._notificationService));
        }
    }

    private onDelete (): void {
        this._dialogService.confirm({
            title: `Deleting ${this._data.name}`,
            content: `Are you sure you want to delete ${this._data.name}?`,
            callback: this.doDelete.bind(this)
        });
    }

    private doDelete (): void {
        this._httpService.delete(`sitecp/betting/category/${this._data.betCategoryId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `${this._data.name} is deleted`
                }));
                this._router.navigateByUrl('/sitecp/betting/categories/page/1');
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData (data: { data: BetCategoryModel }): void {
        this._data = data.data;

        const tabs = [
            {title: 'Save', value: BetCategoryActions.SAVE, condition: true},
            {title: 'Delete', value: BetCategoryActions.DELETE, condition: this._data.createdAt},
            {title: 'Back', value: BetCategoryActions.BACK, condition: true}
        ];
        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
