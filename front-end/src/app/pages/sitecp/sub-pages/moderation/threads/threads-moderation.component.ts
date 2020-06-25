import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ThreadModerate, ThreadModerationActions } from './threads-moderation.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../sitecp.constants';

@Component({
    selector: 'app-sitecp-moderation-threads',
    templateUrl: 'threads-moderation.component.html'
})
export class ThreadsModerationComponent extends Page implements OnDestroy {
    private _threads: Array<ThreadModerate> = [];

    tableConfig: TableConfig;

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _dialogService: DialogService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Moderate Threads',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: Action): void {
        const thread = this._threads.find(th => th.threadId === Number(action.rowId));
        switch (action.value) {
            case ThreadModerationActions.APPROVE_THREAD:
                this._dialogService.confirm({
                    title: `Approve Thread`,
                    content: `Are you sure you want to approve thread: ${thread.title}?`,
                    callback: this.approveThread.bind(this, thread)
                });
                break;
            case ThreadModerationActions.DELETE_THREAD:
                this._dialogService.confirm({
                    title: `Delete Thread`,
                    content: `Are you sure you want to delete thread: ${thread.title}?`,
                    callback: this.deleteThread.bind(this, thread)
                });
                break;
        }
    }

    private approveThread (thread: ThreadModerate): void {
        this._httpService.put(`forum/moderation/thread/approve/${thread.threadId}`)
            .subscribe(() => {
                this._threads = this._threads.filter(th => th.threadId !== thread.threadId);
                this.createOrUpdateTable();
                this._dialogService.closeDialog();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `${thread.title} has now been approved!`
                }));
            });
    }

    private deleteThread (thread: ThreadModerate): void {
        this._httpService.delete(`forum/moderation/thread/delete/${thread.threadId}`)
            .subscribe(() => {
                this._threads = this._threads.filter(th => th.threadId !== thread.threadId);
                this.createOrUpdateTable();
                this._dialogService.closeDialog();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `${thread.title} has now been deleted!`
                }));
            });
    }

    private onPage (data: { data: Array<ThreadModerate> }): void {
        this._threads = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Moderate Threads',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._threads.map(thread => {
            const actions = [
                { title: 'Approve', value: ThreadModerationActions.APPROVE_THREAD, condition: thread.canApprove },
                { title: 'Delete', value: ThreadModerationActions.DELETE_THREAD, condition: thread.canDelete }
            ];
            return new TableRow({
                id: String(thread.threadId),
                cells: [
                    new TableCell({ title: thread.title }),
                    new TableCell({ title: thread.user.nickname }),
                    new TableCell({ title: thread.categoryTitle })
                ],
                actions: actions.filter(action => action.condition).map(action => new TableAction(action))
            });
        });
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Thread' }),
            new TableHeader({ title: 'User' }),
            new TableHeader({ title: 'Category' })
        ];
    }
}
