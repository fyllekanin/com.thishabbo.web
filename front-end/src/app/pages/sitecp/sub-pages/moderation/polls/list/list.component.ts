import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import {
    Action,
    FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { PollListModel, PollsActions, PollsListModel } from './list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { PollsListService } from '../../services/polls-list.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-sitecp-moderation-polls-list',
    templateUrl: 'list.component.html'
})
export class ListComponent extends Page implements OnDestroy {
    private _data: PollsListModel;
    private _filterTimer = null;
    private _filter: QueryParameters;

    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor (
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        private _httpService: HttpService,
        private _service: PollsListService,
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'List Polls',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    onAction (action: Action): void {
        const threadPoll = this._data.polls.find(poll => poll.threadPollId === Number(action.rowId));

        switch (action.value) {
            case PollsActions.DELETE:
                this.onDelete(threadPoll.threadPollId);
                break;
            case PollsActions.VIEW_THREAD:
                this._router.navigateByUrl(`/forum/thread/${threadPoll.threadId}/page/1`);
                break;
            case PollsActions.VIEW:
                this._router.navigateByUrl(`/sitecp/moderation/polls/${threadPoll.threadId}`);
                break;
        }
    }

    onFilter (filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._service.getPolls(filter, 1)
                .subscribe(data => {
                    this.onData({data: data});
                });
        }, 200);
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private onDelete (threadPollId: number): void {
        const poll = this._data.polls.find(item => item.threadPollId === threadPollId);
        this._dialogService.confirm({
            title: `Delete Poll`,
            content: `Are you sure you want to delete this poll?`,
            callback: this.deletePoll.bind(this, threadPollId, poll)
        });
    }

    private deletePoll (threadPollId: number, poll: PollListModel): void {
        this._httpService.delete(`forum/moderation/thread/poll/delete/${poll.threadId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Poll has been deleted!'
                }));
                this._data.polls = this._data.polls.filter(item => item.threadPollId !== threadPollId);
                this.createOrUpdateTable();
                this._dialogService.closeDialog();
            });
    }

    private onData (data: { data: PollsListModel }): void {
        this._data = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: `/sitecp/moderation/polls/page/:page`,
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Polls',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [new FilterConfig({
                title: 'Filter',
                placeholder: 'Search...',
                key: 'filter'
            })]
        });
    }

    private getTableRows (): Array<TableRow> {
        const actions = [
            new TableAction({title: 'View', value: PollsActions.VIEW}),
            new TableAction({title: 'View Thread', value: PollsActions.VIEW_THREAD}),
            new TableAction({title: 'Delete', value: PollsActions.DELETE})
        ];
        return this._data.polls.map(poll => {
            return new TableRow({
                id: String(poll.threadPollId),
                cells: [
                    new TableCell({title: poll.thread}),
                    new TableCell({title: poll.question}),
                    new TableCell({title: String(poll.votes)})
                ],
                actions: actions
            });
        });
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Thread'}),
            new TableHeader({title: 'Question'}),
            new TableHeader({title: 'Votes'})
        ];
    }
}
