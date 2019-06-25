import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { SideMenuBlock, SideMenuItem } from 'shared/app-views/side-menu/side-menu.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-betting',
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

export class BettingComponent extends Page implements OnInit, OnDestroy {
    blocks: Array<SideMenuBlock> = [];

    constructor(breadcrumbService: BreadcrumbService, elementRef: ElementRef) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'Betting Hub' });
    }

    ngOnInit(): void {
        this.blocks = [
            new SideMenuBlock({
                title: 'Betting Hub',
                top: TitleTopBorder.RED,
                color: '#ad6262',
                items: [
                    new SideMenuItem({
                        title: 'Dashboard',
                        link: '/betting/dashboard'
                    }),
                    new SideMenuItem({
                        title: 'Arcade',
                        link: '/arcade'
                    }),
                    new SideMenuItem({
                        title: 'My Active Bets',
                        link: '/betting/my-bets'
                    }),
                    new SideMenuItem({
                        title: 'My History',
                        link: '/betting/history/page/1'
                    })
                ]
            })
        ];
    }

    ngOnDestroy(): void {
        super.destroy();
    }
}
