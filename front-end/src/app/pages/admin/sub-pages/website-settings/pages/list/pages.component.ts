import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import {
    PAGES_BREADCRUMB_ITEM,
    SITECP_BREADCRUMB_ITEM,
    WEBSITE_SETTINGS_BREADCRUMB_ITEM
} from '../../../../admin.constants';
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
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-admin-website-settings-pages',
    templateUrl: 'pages.component.html'
})
export class PagesComponent extends Page implements OnDestroy {
    private _data: Array<PageModel> = [];

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Create New', link: '/admin/website-settings/pages/new' })
    ];
    tableConfig: TableConfig;

    constructor(
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _globalNotificationService: GlobalNotificationService,
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
                WEBSITE_SETTINGS_BREADCRUMB_ITEM,
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onAction(action: Action): void {
        switch (action.value) {
            case PageActions.EDIT:
                this._router.navigateByUrl(`/admin/website-settings/pages/${action.rowId}`);
                break;
            case PageActions.DELETE:
                this.onDelete(Number(action.rowId));
                break;
        }
    }

    private onDelete(pageId: number): void {
        this._dialogService.openConfirmDialog(
            'Are you sure?',
            'Are you sure you wanna delete this page?',
            () => {
                this._httpService.delete(`admin/content/pages/${pageId}`)
                    .subscribe(() => {
                        this._data = this._data.filter(item => item.pageId !== pageId);
                        this.createOrUpdateTable();
                        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                            title: 'Success',
                            message: 'Page is deleted'
                        }));
                    }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
            }
        );
    }

    private onData(data: { data: Array<PageModel> }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable(): void {
        this.tableConfig = new TableConfig({
            title: 'Pages',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Title' }),
            new TableHeader({ title: 'Path' })
        ];
    }

    private getTableRows(): Array<TableRow> {
        const editAction = new TableAction({ title: 'Edit', value: PageActions.EDIT });
        const deleteAction = new TableAction({ title: 'Delete', value: PageActions.DELETE });

        return this._data.map(item => new TableRow({
            id: item.pageId.toString(),
            cells: [
                new TableCell({ title: item.title }),
                new TableCell({ title: `/page/${item.path}` })
            ],
            actions: item.isSystem ? [editAction] : [editAction, deleteAction]
        }));
    }
}
