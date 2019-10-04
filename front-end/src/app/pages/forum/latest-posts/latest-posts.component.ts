import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { LatestPostsPage } from './latest-posts.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { FORUM_BREADCRUM_ITEM } from '../forum.constants';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-forum-latest-posts',
    templateUrl: 'latest-posts.component.html',
    styleUrls: [ 'latest-posts.component.css' ]
})
export class LatestPostsComponent extends Page implements OnDestroy {
    data = new LatestPostsPage(null);
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
            current: 'Latest Posts',
            items: [
                FORUM_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private onPage (data: { data: LatestPostsPage }): void {
        this.data = data.data;

        this.pagination = new PaginationModel({
            page: this.data.page,
            total: this.data.total,
            url: '/forum/latest-posts/page/:page'
        });
    }
}
