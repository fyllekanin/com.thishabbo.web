import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_HUB } from '../shop.constants';
import { LOOT_BOXES } from 'shared/constants/shop.constants';

@Component({
    selector: 'app-shop-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent extends Page implements OnDestroy {
    private _fakeBoxes = [
        {
            name: 'Theme Box',
            getAnimation: function () {
                return LOOT_BOXES.find(item => item.id === 1);
            }
        },
        {
            name: 'Icon Box',
            getAnimation: function () {
                return LOOT_BOXES.find(item => item.id === 5);
            }
        },
        {
            name: 'Effect Box',
            getAnimation: function () {
                return LOOT_BOXES.find(item => item.id === 3);
            }
        }
    ];

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
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
        return this._fakeBoxes;
    }
}
