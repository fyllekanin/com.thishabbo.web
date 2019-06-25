import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import {
    PAGES_BREADCRUMB_ITEM,
    SITECP_BREADCRUMB_ITEM,
    WEBSITE_SETTINGS_BREADCRUMB_ITEM
} from '../../../../sitecp.constants';
import { PageActions, PageModel } from '../page.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-sitecp-website-settings-pages',
    templateUrl: 'pages.component.html'
})
export class PagesComponent extends Page implements OnDestroy {
    private _data: Array<PageModel> = [];

    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Create New', link: '/sitecp/website-settings/pages/new'}),
        new TitleTab({title: 'Back', link: '/sitecp/website-settings'})
    ];
    tableConfig: TableConfig;

    constructor (
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: PAGES_BREADCRUMB_ITEM.title,
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: Action): void {
        switch (action.value) {
            case PageActions.EDIT:
                this._router.navigateByUrl(`/sitecp/website-settings/pages/${action.rowId}`);
                break;
            case PageActions.DELETE:
                this.onDelete(Number(action.rowId));
                break;
        }
    }

    private onDelete (pageId: number): void {
        this._dialogService.confirm({
            title: 'Page Delete',
            content: 'Are you sure you want to delete this page?',
            callback: () => {
                this._httpService.delete(`sitecp/content/pages/${pageId}`)
                    .subscribe(() => {
                        this._data = this._data.filter(item => item.pageId !== pageId);
                        this.createOrUpdateTable();
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Page is deleted'
                        }));
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }

    private onData (data: { data: Array<PageModel> }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Pages',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Title'}),
            new TableHeader({title: 'Path'})
        ];
    }

    private getTableRows (): Array<TableRow> {
        const editAction = new TableAction({title: 'Edit', value: PageActions.EDIT});
        const deleteAction = new TableAction({title: 'Delete', value: PageActions.DELETE});

        return this._data.map(item => new TableRow({
            id: item.pageId.toString(),
            cells: [
                new TableCell({title: item.title}),
                new TableCell({title: `/page/${item.path}`})
            ],
            actions: item.canEdit ? item.isSystem ? [editAction] : [editAction, deleteAction] : []
        }));
    }
}
