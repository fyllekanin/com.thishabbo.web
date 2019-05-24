import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { LatestPostsPage } from './latest-posts.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { ForumLatestPost } from '../forum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { FORUM_BREADCRUM_ITEM } from '../forum.constants';

@Component({
    selector: 'app-forum-latest-posts',
    templateUrl: 'latest-posts.component.html',
    styleUrls: ['latest-posts.component.css']
})
export class LatestPostsComponent extends Page implements OnDestroy {
    private _data: LatestPostsPage;

    pagination: PaginationModel;

    constructor (
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
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

    get items (): Array<ForumLatestPost> {
        return this._data.items;
    }

    private onPage (data: { data: LatestPostsPage }): void {
        this._data = data.data;

        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: '/forum/latest-posts/page/:page'
        });
    }
}
