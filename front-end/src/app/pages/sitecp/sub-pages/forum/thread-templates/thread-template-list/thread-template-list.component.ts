import { ThreadTemplate, ThreadTemplateActions, ThreadTemplateListPage } from '../thread-template.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';


@Component({
    selector: 'app-sitecp-forum-thread-template-list',
    templateUrl: 'thread-template-list.component.html'
})
export class ThreadTemplateListComponent extends Page implements OnDestroy {
    private _data = new ThreadTemplateListPage();

    tableConfig: TableConfig;
    pagination: PaginationModel;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'New Thread Template', link: '/sitecp/forum/thread-templates/new' })
    ];

    constructor (
        private _router: Router,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        private _httpService: HttpService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Thread Templates',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: Action): void {
        const threadTemplate = this._data.items.find(item => item.threadTemplateId === Number(action.rowId));
        switch (action.value) {
            case ThreadTemplateActions.EDIT_THREAD_TEMPLATE:
                this._router.navigateByUrl(`/sitecp/forum/thread-templates/${action.rowId}`);
                break;
            case ThreadTemplateActions.DELETE_THREAD_TEMPLATE:
                this._dialogService.confirm({
                    title: `Delete Thread Templates`,
                    content: `Are you sure that you want to delete the thread template?`,
                    callback: this.onDelete.bind(this, threadTemplate)
                });
                break;
        }
    }

    private onDelete (threadTemplate: ThreadTemplate): void {
        this._httpService.delete(`sitecp/thread-templates/${threadTemplate.threadTemplateId}`)
            .subscribe(() => {
                this._data.items = this._data.items.filter(tt => tt.threadTemplateId !== threadTemplate.threadTemplateId);
                this.createOrUpdateTable();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Thread Template deleted!'
                }));
                this._dialogService.closeDialog();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData (data: { data: ThreadTemplateListPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/sitecp/forum/thread-templates/page/:page'
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Thread Templates',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        const actions = [
            new TableAction({ title: 'Edit Thread Template', value: ThreadTemplateActions.EDIT_THREAD_TEMPLATE }),
            new TableAction({ title: 'Delete Thread Template', value: ThreadTemplateActions.DELETE_THREAD_TEMPLATE })
        ];
        return this._data.items.map(threadTemplate => {
            return new TableRow({
                id: String(threadTemplate.threadTemplateId),
                cells: [
                    new TableCell({ title: threadTemplate.name, })
                ],
                actions: actions
            });
        });
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Name' })
        ];
    }
}

