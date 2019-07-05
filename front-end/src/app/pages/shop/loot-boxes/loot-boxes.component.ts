import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { LootBoxesPage } from './loot-boxes.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_HUB } from '../shop.constants';
import { ShopLootBox } from '../shop.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';

@Component({
    selector: 'app-shop-loot-boxes',
    templateUrl: 'loot-boxes.component.html',
    styleUrls: ['loot-boxes.component.css']
})
export class LootBoxesComponent extends Page implements OnDestroy {
    private _data: LootBoxesPage;

    pagination: PaginationModel;

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Loot Boxes',
            items: [
                SHOP_HUB
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    get lootBoxes (): Array<ShopLootBox> {
        return this._data.items;
    }

    private onData (data: { data: LootBoxesPage }): void {
        this._data = data.data;
        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/shop/loot-boxes/page/:page'
        });
    }
}
