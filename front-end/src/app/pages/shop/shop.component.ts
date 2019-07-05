import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { SideMenuBlock, SideMenuItem } from 'shared/app-views/side-menu/side-menu.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';
import { SHOP_HUB } from './shop.constants';
import { SHOP_ITEM_RARITIES } from 'shared/constants/shop.constants';

@Component({
    selector: 'app-shop',
    template: `
        <div class="grid-container full">
            <div class="grid-x grid-margin-x">
                <div class="cell small-12 medium-9">
                    <router-outlet></router-outlet>
                </div>
                <div class="cell small-12 medium-3">
                    <app-side-menu [blocks]="blocks"></app-side-menu>

                    <app-title [title]="'Rarity Colors'"></app-title>
                    <app-content>
                        <div *ngFor="let rarity of rarities">
                            <strong [style.color]="rarity.color">{{rarity.label}}</strong>
                            <span class="float-right">{{rarity.value}}</span>
                        </div>
                    </app-content>
                </div>
            </div>
        </div>`
})

export class ShopComponent extends Page implements OnInit, OnDestroy {
    blocks: Array<SideMenuBlock> = [];

    rarities: Array<{ label: string, value: string, color: string }> = [];

    constructor (breadcrumbService: BreadcrumbService, elementRef: ElementRef) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({current: SHOP_HUB.title});
    }

    ngOnInit (): void {
        this.blocks = [
            new SideMenuBlock({
                title: 'Shop Hub',
                top: TitleTopBorder.RED,
                color: '#ad6262',
                items: [
                    new SideMenuItem({
                        title: 'Dashboard',
                        link: '/shop/dashboard'
                    }),
                    new SideMenuItem({
                        title: 'Loot Boxes',
                        link: '/shop/loot-boxes/page/1'
                    }),
                    new SideMenuItem({
                        title: 'Subscriptions',
                        link: '/shop/subscriptions/page/1'
                    })
                ]
            })
        ];

        this.rarities = Object.keys(SHOP_ITEM_RARITIES).map(key => {
            return {
                label: SHOP_ITEM_RARITIES[key].label,
                value: `${SHOP_ITEM_RARITIES[key].value}%`,
                color: SHOP_ITEM_RARITIES[key].color
            };
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }
}
