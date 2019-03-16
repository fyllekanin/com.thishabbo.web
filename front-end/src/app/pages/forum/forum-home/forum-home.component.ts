import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { ForumStats, ForumTopPoster } from './forum-home.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ForumLatestPost, SlimCategory } from '../forum.model';
import { ElementRef } from '@angular/core';
import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { HttpService } from 'core/services/http/http.service';

@Component({
    selector: 'app-forum-home',
    templateUrl: 'forum-home.component.html',
    styleUrls: ['forum-home.component.css']
})

export class ForumHomeComponent extends Page implements OnInit, OnDestroy {
    private _forumHomePage: Array<SlimCategory> = [];
    private _forumStats = new ForumStats();
    private _contractedCategories: Array<number> = [];

    latestPostersTop = TitleTopBorder.RED;
    refreshTab = new TitleTab({ title: 'Refresh' });
    toggleTab = new TitleTab({ title: 'Toggle' });

    constructor(
        private _router: Router,
        private _httpService: HttpService,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'Forum' });
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        this._contractedCategories = this.getContractedCategories();
    }

    ngOnInit(): void {
        this.updateForumStats();
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    toggleCategory(category: SlimCategory): void {
        if (this._contractedCategories.indexOf(category.categoryId) > -1) {
            this._contractedCategories = this._contractedCategories.filter(categoryId => categoryId !== category.categoryId);
        } else {
            this._contractedCategories.push(category.categoryId);
        }
        this.updateContractedCategories();
    }

    isCategoryContracted(category: SlimCategory): boolean {
        return this._contractedCategories.indexOf(category.categoryId) > -1;
    }

    onTitleClick(category: SlimCategory): void {
        const url = category.link || `/forum/category/${category.categoryId}/page/1`;
        this._router.navigateByUrl(url);
    }

    sortCategories(a: SlimCategory, b: SlimCategory): number {
        if (a.displayOrder > b.displayOrder) {
            return 1;
        } else if (a.displayOrder < b.displayOrder) {
            return -1;
        }
        return 0;
    }

    updateForumStats(): void {
        this._forumStats = new ForumStats();
        const todayMidnight = new Date().setHours(0, 0, 0, 0) / 1000;
        this._httpService.get(`page/forum/stats/${todayMidnight}`)
            .subscribe(res => {
                this._forumStats = new ForumStats(res);
            });
    }

    get categories(): Array<SlimCategory> {
        return this._forumHomePage.sort(this.sortCategories);
    }

    get latestPosts(): Array<ForumLatestPost> {
        return this._forumStats.latestPosts;
    }

    get topPostersToday(): Array<ForumTopPoster> {
        return this._forumStats.topPostersToday;
    }

    get topPosters(): Array<ForumTopPoster> {
        return this._forumStats.topPosters;
    }

    private onPage(data: { data: Array<SlimCategory> }): void {
        this._forumHomePage = data.data;
    }

    private updateContractedCategories(): void {
        localStorage.setItem(LOCAL_STORAGE.CONTRACTED_CATEGORIES, JSON.stringify(this._contractedCategories));
    }

    private getContractedCategories(): Array<number> {
        const stored = localStorage.getItem(LOCAL_STORAGE.CONTRACTED_CATEGORIES);
        return stored ? JSON.parse(stored) : [];
    }
}
