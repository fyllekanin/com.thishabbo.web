import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { FORUM_BREADCRUM_ITEM } from '../forum.constants';
import { LatestThreadsPage } from './latest-threads.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-forum-latest-threads',
    templateUrl: 'latest-threads.component.html',
    styleUrls: [ 'latest-threads.component.css' ]
})
export class LatestThreadsComponent extends Page implements OnDestroy {
    data = new LatestThreadsPage(null);
    pagination: PaginationModel;
    isSingleRow = false;

    constructor (
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        this.isSingleRow = Boolean(localStorage.getItem(LOCAL_STORAGE.SINGLE_LATEST_ROW));
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

    private onPage (data: { data: LatestThreadsPage }): void {
        this.data = data.data;

        this.pagination = new PaginationModel({
            page: this.data.page,
            total: this.data.total,
            url: '/forum/latest-threads/page/:page'
        });
    }
}
