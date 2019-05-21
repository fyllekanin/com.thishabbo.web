import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { SubscriptionItem } from '../subscriptions.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_SUBSCRIPTIONS_BREADCRUMB_ITEMS, SITECP_BREADCRUMB_ITEM } from '../../../../admin.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { SubscriptionAction } from './subscription.model';
import { SubscriptionService } from '../../services/subscription.service';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-admin-shop-subscription',
    templateUrl: 'subscription.component.html'
})
export class SubscriptionComponent extends Page implements OnDestroy {
    private _data: SubscriptionItem;

    tabs: Array<TitleTab> = [];

    constructor (
        private _service: SubscriptionService,
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Subscription',
            items: [
                SITECP_BREADCRUMB_ITEM,
                SHOP_SUBSCRIPTIONS_BREADCRUMB_ITEMS
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onTabClick (action: number): void {
        switch (action) {
            case SubscriptionAction.SAVE:
                this.onSave();
                break;
            case SubscriptionAction.DELETE:
                this.onDelete();
                break;
            case SubscriptionAction.CANCEL:
                this._router.navigateByUrl('/admin/shop/subscriptions/page/1');
                break;
        }
    }

    get title (): string {
        return `${this._data.createdAt ? 'Editing: ' : 'Creating: '} ${this._data.title}`;
    }

    get model (): SubscriptionItem {
        return this._data;
    }

    private onSave (): void {
        if (this._data.createdAt) {
            this._service.update(this._data).then(() => {
                this._data.createdAt = TimeHelper.getTime(new Date().getTime() / 1000);
            });
        } else {
            this._service.save(this._data).then(() => {
                this._data.createdAt = TimeHelper.getTime(new Date().getTime() / 1000);
                this.setTabs();
            });
        }
    }

    private onDelete (): void {
        this._service.delete(this._data).then(() => {
            this._router.navigateByUrl('/admin/shop/subscriptions/page/1');
        });
    }

    private onData (data: { data: SubscriptionItem }): void {
        this._data = data.data;
        this.setTabs();
    }

    private setTabs (): void {
        const tabs = [
            {title: 'Save', value: SubscriptionAction.SAVE, condition: true},
            {title: 'Delete', value: SubscriptionAction.DELETE, condition: this._data.createdAt},
            {title: 'Cancel', value: SubscriptionAction.CANCEL, condition: true}
        ];
        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
