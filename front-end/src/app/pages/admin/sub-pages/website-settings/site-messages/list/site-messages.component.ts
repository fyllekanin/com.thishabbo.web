import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import {
    SITE_MESSAGES_BREADCRUMB_ITEM,
    SITECP_BREADCRUMB_ITEM,
    WEBSITE_SETTINGS_BREADCRUMB_ITEM
} from '../../../../admin.constants';
import { SiteMessageModel, SiteMessagesActions } from '../site-message.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-admin-website-settings-site-messages',
    templateUrl: 'site-messages.component.html',
    styleUrls: ['site-messages.component.css']
})
export class SiteMessagesComponent extends Page implements OnDestroy {
    private _data: Array<SiteMessageModel> = [];

    tableConfig: TableConfig;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Create New', link: '/admin/website-settings/site-messages/new' })
    ];

    constructor(
        private _router: Router,
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: SITE_MESSAGES_BREADCRUMB_ITEM.title,
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onAction(action: Action): void {
        switch (action.value) {
            case SiteMessagesActions.EDIT:
                this._router.navigateByUrl(`/admin/website-settings/site-messages/${action.rowId}`);
                break;
            case SiteMessagesActions.DELETE:
                const siteMessage = this._data.find(item => item.siteMessageId === Number(action.rowId));
                this._dialogService.openConfirmDialog(
                    'Are you sure?',
                    `Are you sure you wanna delete ${siteMessage.title}?`,
                    () => {
                        this._httpService.delete(`admin/content/site-messages/${action.rowId}`)
                            .subscribe(() => {
                                this._data = this._data.filter(item => item.siteMessageId === siteMessage.siteMessageId);
                                this.createOrUpdateTable();
                                this._notificationService.sendNotification(new NotificationModel({
                                    title: 'Success',
                                    message: 'Site message is deleted'
                                }));
                            });
                    }
                );
                break;
        }
    }

    private onData(data: { data: Array<SiteMessageModel> }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Site Messages',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows(): Array<TableRow> {
        const actions = [
            new TableAction({ title: 'Edit', value: SiteMessagesActions.EDIT }),
            new TableAction({ title: 'Delete', value: SiteMessagesActions.DELETE  })
        ];
        return this._data.map(item => new TableRow({
            id: item.siteMessageId.toString(),
            cells: [
                new TableCell({ title: item.title }),
                new TableCell({ title: item.isActive ? 'Yes' : 'No' }),
                new TableCell({ title: TimeHelper.getLongDateWithTime(item.createdAt) })
            ],
            actions: actions
        }));
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Title' }),
            new TableHeader({ title: 'Is Active' }),
            new TableHeader({ title: 'Created At' })
        ];
    }
}
