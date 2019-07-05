import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_HUB } from '../shop.constants';
import { DashboardPage } from './dashboardPage';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-shop-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent extends Page implements OnDestroy {
    private _data: DashboardPage;

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Dashboard',
            items: [
                SHOP_HUB
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    get boxes () {
        return this._data.lootBoxes;
    }

    get subscriptions () {
        return this._data.subscriptions;
    }

    private onData (data: { data: DashboardPage }): void {
        this._data = data.data;
    }
}
