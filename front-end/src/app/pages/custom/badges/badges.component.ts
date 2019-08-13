import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { ActivatedRoute } from '@angular/router';
import { BadgeModel } from 'shared/components/badges/badges.model';
import { BadgePage } from './badges.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';

@Component({
    selector: 'app-custom-badges',
    templateUrl: 'badges.component.html',
    styleUrls: ['badges.component.css']
})
export class BadgesComponent extends Page implements OnDestroy {
    private _data: BadgePage;

    pagination: PaginationModel;

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Badges'
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    get items (): Array<BadgeModel> {
        return this._data.items;
    }

    private onData (data: { data: BadgePage }): void {
        this._data = data.data;
        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/page/badges/page/:page'
        });
    }
}
