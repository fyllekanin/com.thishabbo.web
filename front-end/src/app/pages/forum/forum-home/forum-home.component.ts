import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { ForumStats, ForumTopPoster, StatsActions } from './forum-home.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ForumLatestPost, SlimCategory } from '../forum.model';
import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { HttpService } from 'core/services/http/http.service';
import { SlimUser } from 'core/services/auth/auth.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { AuthService } from 'core/services/auth/auth.service';
import { ArrayHelper } from 'shared/helpers/array.helper';

@Component({
    selector: 'app-forum-home',
    templateUrl: 'forum-home.component.html',
    styleUrls: ['forum-home.component.css']
})

export class ForumHomeComponent extends Page implements OnInit, OnDestroy {
    private _forumHomePage: Array<SlimCategory> = [];
    private _forumStats: ForumStats;
    private _contractedCategories: Array<number> = [];

    latestPostersTop = TitleTopBorder.RED;
    statTabs: Array<TitleTopBorder> = [
        new TitleTab({title: 'Refresh', value: StatsActions.REFRESH}),
        new TitleTab({title: 'Read All', value: StatsActions.READ_ALL})
    ];
    toggleTab = new TitleTab({title: 'Toggle'});
    isForumStatsHidden = false;

    constructor (
        private _router: Router,
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _authService: AuthService,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({current: 'Forum'});
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        this._contractedCategories = this.getContractedCategories();
        this.isForumStatsHidden = Boolean(localStorage.getItem(LOCAL_STORAGE.HIDE_FORUM_STATS));
    }

    ngOnInit (): void {
        if (!this._authService.isLoggedIn()) {
            return;
        }
        this.updateForumStats();
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    toggleCategory (category: SlimCategory): void {
        if (this._contractedCategories.indexOf(category.categoryId) > -1) {
            this._contractedCategories = this._contractedCategories.filter(categoryId => categoryId !== category.categoryId);
        } else {
            this._contractedCategories.push(category.categoryId);
        }
        this.updateContractedCategories();
    }

    isCategoryContracted (category: SlimCategory): boolean {
        return this._contractedCategories.indexOf(category.categoryId) > -1;
    }

    onTitleClick (category: SlimCategory): void {
        const url = category.link || `/forum/category/${category.categoryId}/page/1`;
        this._router.navigateByUrl(url);
    }

    updateForumStats (): void {
        if (this.isForumStatsHidden) {
            return;
        }
        this._forumStats = new ForumStats();
        const todayMidnight = new Date().setHours(0, 0, 0, 0) / 1000;
        this._httpService.get(`page/forum/stats/${todayMidnight}`)
            .subscribe(res => {
                this._forumStats = new ForumStats(res);
            });
    }

    onStatsTabClick (action: number): void {
        switch (action) {
            case StatsActions.REFRESH:
                this.updateForumStats();
                break;
            case StatsActions.READ_ALL:
                this.readAll();
                break;
        }
    }

    get categories (): Array<SlimCategory> {
        return this._forumHomePage;
    }

    get latestPosts (): Array<ForumLatestPost> {
        return this._forumStats.latestPosts;
    }

    get topPostersToday (): Array<ForumTopPoster> {
        return this._forumStats.topPostersToday;
    }

    get topPosters (): Array<ForumTopPoster> {
        return this._forumStats.topPosters;
    }

    get currentlyActive (): Array<SlimUser> {
        return this._forumStats.currentlyActive;
    }

    get activeToday (): Array<SlimUser> {
        return this._forumStats.activeToday;
    }

    get currentlyActiveTitle (): string {
        return this.currentlyActive.length + ' users currently active';
    }

    get activeTodayTitle (): string {
        return this.activeToday.length + ' users active in the last 24 hours';
    }

    get haveForumStats (): boolean {
        return Boolean(this._forumStats);
    }

    private onPage (data: { data: Array<SlimCategory> }): void {
        this._forumHomePage = data.data;
        this._forumHomePage.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'displayOrder'));
    }

    private updateContractedCategories (): void {
        localStorage.setItem(LOCAL_STORAGE.CONTRACTED_CATEGORIES, JSON.stringify(this._contractedCategories));
    }

    private getContractedCategories (): Array<number> {
        const stored = localStorage.getItem(LOCAL_STORAGE.CONTRACTED_CATEGORIES);
        return stored ? JSON.parse(stored) : [];
    }

    private readAll (): void {
        this._httpService.put('forum/category/read-all').subscribe(() => {
            this._forumHomePage = this._forumHomePage.map(category => {
                category.haveRead = true;
                category.children.forEach(child => child.haveRead = true);
                return category;
            });
            this._notificationService.sendInfoNotification('You marked all current posts read!');
        });
    }
}
