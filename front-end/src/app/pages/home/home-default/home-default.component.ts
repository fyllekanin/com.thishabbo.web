import { Notice } from 'shared/components/notice/notice.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HomeDefaultPage, HomePageThread } from './home-default.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'core/services/auth/auth.service';
import { SlimArticle } from 'shared/components/slim-article/slim-article.model';

@Component({
    selector: 'app-page-home-default',
    templateUrl: 'home-default.component.html',
    styleUrls: ['home-default.component.css']
})

export class HomeDefaultComponent extends Page implements OnInit, OnDestroy {
    private _page: HomeDefaultPage = new HomeDefaultPage();

    constructor (
        private _authService: AuthService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);

        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Home'
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    ngOnInit (): void {
        this._page = this._activatedRoute.snapshot.data['data'];
    }

    seeMoreBadgeArticles (): void {
        this._router.navigateByUrl('/page/badge-articles/page/1');
    }

    get threads (): Array<HomePageThread> {
        return this._page.threads;
    }

    get isLoggedIn (): boolean {
        return this._authService.isLoggedIn();
    }

    get articles (): Array<SlimArticle> {
        return this._page.articles;
    }

    get mediaArticles (): Array<SlimArticle> {
        return this._page.mediaArticles;
    }

    get notices (): Array<Notice> {
        return this._page.notices.sort((a, b) => {
            if (a.order > b.order) {
                return 1;
            } else if (a.order < b.order) {
                return -1;
            }
            return 0;
        });
    }
}
