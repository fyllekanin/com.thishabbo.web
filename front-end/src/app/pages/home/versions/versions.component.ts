import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { VersionItem, VersionsPage } from './versions.model';
import { ActivatedRoute } from '@angular/router';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';

@Component({
    selector: 'app-home-versions',
    templateUrl: 'versions.component.html',
    styleUrls: [ 'versions.component.css' ]
})
export class VersionsComponent extends Page implements OnDestroy {
    private _data: VersionsPage;

    pagination: PaginationModel;

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Versions'
        });
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    ngOnDestroy () {
        super.destroy();
    }

    get versions (): Array<VersionItem> {
        return this._data.items;
    }

    private onData (data: { data: VersionsPage }): void {
        this._data = data.data;

        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/home/versions/page/:page'
        });
    }
}

