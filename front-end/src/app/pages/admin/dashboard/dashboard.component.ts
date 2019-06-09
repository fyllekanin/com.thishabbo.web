import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { SITECP_BREADCRUMB_ITEM } from '../admin.constants';
import { TableConfig, TableHeader } from 'shared/components/table/table.model';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';
import { ActivatedRoute } from '@angular/router';
import { DashboardModel } from './dashboard.model';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent extends Page implements OnInit, OnDestroy {
    private _data: DashboardModel;

    tableConfig: TableConfig;
    stats: Array<StatsBoxModel> = [];

    constructor (
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Dashboard',
            items: [SITECP_BREADCRUMB_ITEM]
        });
    }

    ngOnInit (): void {
        this.tableConfig = new TableConfig({
            title: 'Dashboard',
            headers: [
                new TableHeader({title: 'Header #1'}),
                new TableHeader({title: 'Header #2'}),
                new TableHeader({title: 'Header #3'})
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private onData (data: { data: DashboardModel }): void {
        this._data = data.data;
        this.stats = this.getStats();
    }

    private getStats (): Array<StatsBoxModel> {
        return [
            new StatsBoxModel({
                borderColor: TitleTopBorder.GREEN,
                icon: 'far fa-comment',
                title: this._data.stats.posts.toString(),
                breadText: 'Posts Today'
            }),
            new StatsBoxModel({
                borderColor: TitleTopBorder.RED,
                icon: 'far fa-comments',
                title: this._data.stats.threads.toString(),
                breadText: 'Threads Today'
            }),
            new StatsBoxModel({
                borderColor: TitleTopBorder.BLUE,
                icon: 'fas fa-coins',
                title: this._data.stats.credits.toString(),
                breadText: 'Credits In Economy'
            }),
            new StatsBoxModel({
                borderColor: TitleTopBorder.PINK,
                icon: 'far fa-address-book',
                title: this._data.stats.subscriptions.toString(),
                breadText: 'Active Subscriptions'
            })
        ];
    }
}
