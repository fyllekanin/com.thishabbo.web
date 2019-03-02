import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { SITECP_BREADCRUMB_ITEM } from '../admin.constants';
import { TableConfig, TableHeader } from 'shared/components/table/table.model';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent extends Page implements OnInit, OnDestroy {

    tableConfig: TableConfig;

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
