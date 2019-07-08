import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { FollowersAction, FollowersPage } from './followers.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
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
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-usercp-account-followers',
    templateUrl: 'followers.component.html'
})
export class FollowersComponent extends Page implements OnDestroy {
    private _data: FollowersPage;
    private _awaitingActions: Array<TableAction> = [
        new TableAction({title: 'Approve', value: FollowersAction.APPROVE}),
        new TableAction({title: 'Deny', value: FollowersAction.DENY})
    ];
    private _followerActions: Array<TableAction> = [
        new TableAction({title: 'Remove', value: FollowersAction.REMOVE})
    ];

    pagination: PaginationModel;
    awaitingTable: TableConfig;
    followersTable: TableConfig;

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Followers',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onAction (action: Action): void {
        switch (action.value) {
            case FollowersAction.APPROVE:
                this.onApprove(Number(action.rowId));
                break;
            case FollowersAction.DENY:
                this.onDeny(Number(action.rowId));
                break;
            case FollowersAction.REMOVE:
                this.onRemove(Number(action.rowId));
                break;
        }
    }

    private onApprove (followerId: number): void {
        this._httpService.put(`usercp/followers/approve/${followerId}`)
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Follower approved!');
                const follower = this._data.awaiting.find(item => item.followerId === followerId);
                this._data.awaiting = this._data.awaiting.filter(item => item.followerId !== followerId);
                this._data.followers.push(follower);
                this.updateTables();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onDeny (followerId: number): void {
        this._httpService.delete(`usercp/followers/deny/${followerId}`)
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Follower denied!');
                this._data.awaiting = this._data.awaiting.filter(item => item.followerId !== followerId);
                this.updateTables();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onRemove (followerId: number): void {
        this._httpService.delete(`usercp/followers/remove/${followerId}`)
            .subscribe(() => {
                this._notificationService.sendInfoNotification('Follower removed!');
                this._data.followers = this._data.followers.filter(item => item.followerId !== followerId);
                this.updateTables();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData (data: { data: FollowersPage }): void {
        this._data = data.data;
        this.updateTables();

        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/user/usercp/account/followers/page/:page'
        });
    }

    private updateTables (): void {
        this.createOrUpdateAwaitingTable();
        this.createOrUpdateFollowersTable();
    }

    private createOrUpdateAwaitingTable (): void {
        if (this.awaitingTable) {
            this.awaitingTable.rows = this.getAwaitingTableRows();
            return;
        }
        this.awaitingTable = new TableConfig({
            title: 'Follower Requests',
            headers: this.getAwaitingTableHeaders(),
            rows: this.getAwaitingTableRows()
        });
    }

    private createOrUpdateFollowersTable (): void {
        if (this.followersTable) {
            this.followersTable.rows = this.getFollowersTableRows();
            return;
        }
        this.followersTable = new TableConfig({
            title: 'Followers',
            headers: this.getFollowersTableHeaders(),
            rows: this.getFollowersTableRows()
        });
    }

    private getAwaitingTableRows (): Array<TableRow> {
        return this._data.awaiting.map(item => new TableRow({
            id: String(item.followerId),
            cells: [
                new TableCell({title: item.user.nickname}),
                new TableCell({title: TimeHelper.getLongDateWithTime(item.createdAt)})
            ],
            actions: this._awaitingActions
        }));
    }

    private getFollowersTableRows (): Array<TableRow> {
        return this._data.followers.map(item => new TableRow({
            id: String(item.followerId),
            cells: [
                new TableCell({title: item.user.nickname}),
                new TableCell({title: TimeHelper.getLongDateWithTime(item.createdAt)})
            ],
            actions: this._followerActions
        }));
    }

    private getAwaitingTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Nickname'}),
            new TableHeader({title: 'Requested At'})
        ];
    }

    private getFollowersTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Nickname'}),
            new TableHeader({title: 'Followed At'})
        ];
    }
}
