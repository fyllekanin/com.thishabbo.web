import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import {
    SITE_MESSAGES_BREADCRUMB_ITEM,
    SITECP_BREADCRUMB_ITEM,
    WEBSITE_SETTINGS_BREADCRUMB_ITEM
} from '../../../../sitecp.constants';
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
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-sitecp-website-settings-site-messages',
    templateUrl: 'site-messages.component.html'
})
export class SiteMessagesComponent extends Page implements OnDestroy {
    private _data: Array<SiteMessageModel> = [];

    tableConfig: TableConfig;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Create New', link: '/sitecp/website-settings/site-messages/new' }),
        new TitleTab({ title: 'Back', link: '/sitecp/website-settings' })
    ];

    constructor (
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

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: Action): void {
        switch (action.value) {
            case SiteMessagesActions.EDIT:
                this._router.navigateByUrl(`/sitecp/website-settings/site-messages/${action.rowId}`);
                break;
            case SiteMessagesActions.DELETE:
                const siteMessage = this._data.find(item => item.siteMessageId === Number(action.rowId));
                this._dialogService.confirm({
                    title: 'Delete Site Message',
                    content: `Are you sure you want to delete ${siteMessage.title}?`,
                    callback: () => {
                        this._httpService.delete(`sitecp/content/site-messages/${action.rowId}`)
                            .subscribe(() => {
                                this._dialogService.closeDialog();
                                this._data = this._data.filter(item => item.siteMessageId !== siteMessage.siteMessageId);
                                this.createOrUpdateTable();
                                this._notificationService.sendNotification(new NotificationMessage({
                                    title: 'Success',
                                    message: 'Site message has been deleted!'
                                }));
                            });
                    }
                });
                break;
        }
    }

    private onData (data: { data: Array<SiteMessageModel> }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Active Site Messages',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        const actions = [
            new TableAction({ title: 'Edit', value: SiteMessagesActions.EDIT }),
            new TableAction({ title: 'Delete', value: SiteMessagesActions.DELETE })
        ];
        return this._data.map(item => new TableRow({
            id: item.siteMessageId.toString(),
            cells: [
                new TableCell({ title: item.title }),
                new TableCell({ title: item.isExpired() ? 'Expired' : TimeHelper.getLongDate(item.expiresAt) }),
                new TableCell({ title: TimeHelper.getLongDateWithTime(item.createdAt) })
            ],
            actions: actions
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Title' }),
            new TableHeader({ title: 'Expires At' }),
            new TableHeader({ title: 'Created At' })
        ];
    }
}
