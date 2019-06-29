import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { SideMenuBlock, SideMenuItem } from 'shared/app-views/side-menu/side-menu.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';
import { SHOP_HUB } from './shop.constants';

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
                </div>
            </div>
        </div>`
})

export class ShopComponent extends Page implements OnInit, OnDestroy {
    blocks: Array<SideMenuBlock> = [];

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
                        link: '/betting/loot-boxes'
                    }),
                    new SideMenuItem({
                        title: 'Subscriptions',
                        link: '/shop/subscriptions'
                    })
                ]
            })
        ];
    }

    ngOnDestroy (): void {
        super.destroy();
    }
}
