import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_HUB } from '../shop.constants';
import { DashboardModel, RotatedItem } from './dashboard.model';
import { ActivatedRoute } from '@angular/router';
import { ShopLootBox, ShopSubscription } from '../shop.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-shop-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: [ 'dashboard.component.css' ]
})
export class DashboardComponent extends Page implements OnDestroy {
    private _data: DashboardModel;
    private _interval;

    rotatedItemsCountdown: string;

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

        this.rotatedItemsCountdown = TimeHelper.getUntil(this.getTomorrowMidnight());
        this._interval = setInterval(() => {
            this.rotatedItemsCountdown = TimeHelper.getUntil(this.getTomorrowMidnight());
        }, 1000);
    }

    ngOnDestroy (): void {
        super.destroy();
        clearInterval(this._interval);
    }

    get boxes (): Array<ShopLootBox> {
        return this._data.lootBoxes;
    }

    get rotatedItem (): Array<RotatedItem> {
        return this._data.rotatedItems;
    }

    get subscriptions (): Array<ShopSubscription> {
        return this._data.subscriptions;
    }

    private onData (data: { data: DashboardModel }): void {
        this._data = data.data;
    }

    private getTomorrowMidnight (): Date {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() + 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
    }
}
