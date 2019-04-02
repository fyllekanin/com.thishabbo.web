import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SearchPage, SearchParameters, SearchResult } from './search.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleTab } from 'shared/app-views/title/title.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-home-search',
    templateUrl: 'search.component.html',
    styleUrls: ['search.component.css']
})
export class SearchComponent extends Page implements OnDestroy {
    private _data: SearchPage;

    pagination: PaginationModel;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Search' })
    ];

    constructor(
        private _router: Router,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Search'
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onKeyUp(event): void {
        if (event.keyCode === 13) {
            this.onSearch();
        }
    }

    onSearch(): void {
        const url = `/home/search/${this._data.parameters.type}/page/1`;

        this._router.navigateByUrl(this._router.createUrlTree(
            [url], { queryParams: this.getQueryParameters() }
        ));
    }

    get parameters(): SearchParameters {
        return this._data ? this._data.parameters : new SearchParameters({});
    }

    get items(): Array<SearchResult> {
        return this._data.items;
    }

    private onData(data: { data: SearchPage }): void {
        this._data = data.data;

        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: `/home/search/${this._data.parameters.type}/page/:page`,
            params: this.getQueryParameters()
        });
    }

    private getQueryParameters(): QueryParameters {
        return Object.keys(this._data.parameters).filter(key => key !== 'type')
            .reduce((prev, curr) => {
                prev[curr] = this._data.parameters[curr];
                return prev;
            }, {});
    }
}