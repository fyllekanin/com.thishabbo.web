import { Component, ElementRef, OnDestroy } from '@angular/core';
import { BadgeArticlesPage } from './badge-articles.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SlimArticle } from 'shared/components/slim-article/slim-article.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';

@Component({
    selector: 'app-custom-badge-articles',
    templateUrl: 'badge-articles.component.html',
    styleUrls: ['badge-articles.component.css']
})
export class BadgeArticlesComponent extends Page implements OnDestroy {
    private _data: BadgeArticlesPage;

    pagination: PaginationModel;

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Badge Articles'
        });
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    ngOnDestroy () {
        super.destroy();
    }

    get articles (): Array<SlimArticle> {
        return this._data.items;
    }

    private onData (data: { data: BadgeArticlesPage }): void {
        this._data = data.data;

        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/page/badge-articles/page/:page'
        });
    }
}
