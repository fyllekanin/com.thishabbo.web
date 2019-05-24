import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { FORUM_BREADCRUM_ITEM } from '../forum.constants';
import { LatestThread, LatestThreadsPage } from './latest-threads.model';

@Component({
    selector: 'app-forum-latest-threads',
    templateUrl: 'latest-threads.component.html',
    styleUrls: ['latest-threads.component.css']
})
export class LatestThreadsComponent extends Page implements OnDestroy {
    private _data: LatestThreadsPage;

    pagination: PaginationModel;

    constructor (
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Latest Threads',
            items: [
                FORUM_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    get items (): Array<LatestThread> {
        return this._data.items;
    }

    private onPage (data: { data: LatestThreadsPage }): void {
        this._data = data.data;

        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: '/forum/latest-threads/page/:page'
        });
    }
}
