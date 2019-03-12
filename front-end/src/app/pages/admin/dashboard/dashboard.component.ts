import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { SITECP_BREADCRUMB_ITEM } from '../admin.constants';
import { TableConfig, TableHeader } from 'shared/components/table/table.model';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { TitleTopBorder } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent extends Page implements OnInit, OnDestroy {
    tableConfig: TableConfig;
    stats: Array<StatsBoxModel> = [
        new StatsBoxModel({
            borderColor: TitleTopBorder.GREEN,
            icon: 'fas fa-coins',
            title: 'Template 1',
            breadText: 'Template 1'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.RED,
            icon: 'fas fa-gem',
            title: 'Template 2',
            breadText: 'Template 2'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.BLUE,
            icon: 'fas fa-thumbs-up',
            title: 'Template 3',
            breadText: 'Template 3'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.PINK,
            icon: 'fas fa-thumbs-down',
            title: 'Template 4',
            breadText: 'Template 4'
        })
    ];

    constructor(
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Dashboard',
            items: [SITECP_BREADCRUMB_ITEM]
        });
    }

    ngOnInit(): void {
        this.tableConfig = new TableConfig({
            title: 'Dashboard',
            headers: [
                new TableHeader({ title: 'Header #1' }),
                new TableHeader({ title: 'Header #2' }),
                new TableHeader({ title: 'Header #3' })
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }
}
