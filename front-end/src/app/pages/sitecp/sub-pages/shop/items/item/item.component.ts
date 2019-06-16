import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_ITEMS_BREADCRUMB_ITEMS, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { ShopItem, ShopItemActions } from '../items.model';
import { CONFIGURABLE_ITEMS, SHOP_ITEM_RARITIES } from 'shared/constants/shop.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { SlimSubscription } from '../../../users/subscriptions/subscriptions.model';

@Component({
    selector: 'app-sitecp-shop-item',
    templateUrl: 'item.component.html',
    styleUrls: ['item.component.css']
})
export class ItemComponent extends Page implements OnDestroy {
    private _data: ShopItem;
    private readonly _configurableRarities: Array<{ label: string, value: number }> = [];

    @ViewChild('image', {static: false}) image;
    tabs: Array<TitleTab> = [];

    constructor(
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        this._configurableRarities = [
            SHOP_ITEM_RARITIES.common,
            SHOP_ITEM_RARITIES.rare,
            SHOP_ITEM_RARITIES.epic,
            SHOP_ITEM_RARITIES.legendary
        ];
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Shop Item',
            items: [
                SITECP_BREADCRUMB_ITEM,
                SHOP_ITEMS_BREADCRUMB_ITEMS
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    get title(): string {
        return `${this._data.createdAt ? 'Editing: ' : 'Creating: '} ${this._data.title}`;
    }

    get model(): ShopItem {
        return this._data;
    }

    get types(): Array<{ label: string, value: number }> {
        return CONFIGURABLE_ITEMS;
    }

    get rarities(): Array<{ label: string, value: number }> {
        return this._configurableRarities;
    }

    get subscriptions(): Array<SlimSubscription> {
        return this._data.subscriptions;
    }

    private onData(data: { data: ShopItem }): void {
        this._data = data.data;
        this.setTabs();
    }

    private setTabs(): void {
        const tabs = [
            {title: 'Save', value: ShopItemActions.SAVE, condition: true},
            {title: 'Delete', value: ShopItemActions.DELETE, condition: this._data.createdAt},
            {title: 'Back', value: ShopItemActions.BACK, condition: true}
        ];
        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }
}
