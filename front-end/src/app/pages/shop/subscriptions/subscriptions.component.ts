import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_HUB } from '../shop.constants';
import { ShopSubscription } from '../shop.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { SubscriptionsPage } from './subscriptions.model';

@Component({
    selector: 'app-shop-subscriptions',
    templateUrl: 'subscriptions.component.html',
    styleUrls: ['subscriptions.component.css']
})
export class SubscriptionsComponent extends Page implements OnDestroy {
    private _data: SubscriptionsPage;

    pagination: PaginationModel;

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Subscriptions',
            items: [
                SHOP_HUB
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    get subscriptions (): Array<ShopSubscription> {
        return this._data.items;
    }

    private onData (data: { data: SubscriptionsPage }): void {
        this._data = data.data;
        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/shop/subscriptions/page/:page'
        });
    }
}
