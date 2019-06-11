import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Page } from 'shared/page/page.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sitecp-website-settings',
    template: '<app-table [config]="tableConfig" (onAction)="onAction($event)"></app-table>'
})
export class WebsiteSettingsComponent extends Page implements OnDestroy, OnInit {

    private readonly PAGES = [
        {
            id: 'maintenance',
            path: '/sitecp/website-settings/maintenance',
            name: 'Maintenance',
            description: 'Handle maintenance'
        },
        {
            id: 'welcome-bot',
            path: '/sitecp/website-settings/welcome-bot',
            name: 'Welcome Bot',
            description: 'Manage the welcome bot'
        },
        {
            id: 'notices',
            path: '/sitecp/website-settings/notice-board',
            name: 'Notices',
            description: 'Manage the notice board'
        },
        {
            id: 'staff-of-the-week',
            path: '/sitecp/website-settings/staff-of-the-week',
            name: 'SOTW',
            description: 'Manage the SOTW'
        },
        {
            id: 'staff-of-the-month',
            path: '/sitecp/website-settings/member-of-the-month',
            name: 'MOTM',
            description: 'Manage the MOTM'
        },
        {
            id: 'navigation',
            path: '/sitecp/website-settings/navigation',
            name: 'Navigation',
            description: 'Manage the navigation'
        },
        {
            id: 'site-messages',
            path: '/sitecp/website-settings/site-messages',
            name: 'Site Messages',
            description: 'Manage the site messages'
        },
        {
            id: 'pages',
            path: '/sitecp/website-settings/pages',
            name: 'Pages',
            description: 'Manage the pages'
        },
        {
            id: 'themes',
            path: '/sitecp/website-settings/themes',
            name: 'Themes',
            description: 'Manage the themes'
        },
        {
            id: 'home-page-threads',
            path: '/sitecp/website-settings/home-page-threads',
            name: 'Home Page Threads',
            description: 'Manage categories which are fetched from Homepage'
        }
    ];

    tableConfig: TableConfig;

    constructor (
        private _router: Router,
        elementRef: ElementRef
    ) {
        super(elementRef);
    }

    onAction (action: Action): void {
        const page = this.PAGES
            .find(item => item.id === action.rowId);
        if (page) {
            this._router.navigateByUrl(page.path);
        }
    }

    ngOnInit (): void {
        this.tableConfig = new TableConfig({
            title: 'Website Settings',
            headers: WebsiteSettingsComponent.getTableHeaders(),
            rows: this.PAGES.map(page => new TableRow({
                id: page.id,
                cells: [
                    new TableCell({title: page.name}),
                    new TableCell({title: page.description})
                ],
                actions: [
                    new TableAction({title: 'Configure', value: null})
                ]
            }))
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    static getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Page'}),
            new TableHeader({title: 'Description'})
        ];
    }
}