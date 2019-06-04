import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { BadgeUser, BadgeUsersModel } from './badge-users.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BADGE_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';

@Component({
    selector: 'app-admin-badges-users',
    templateUrl: 'badge-users.component.html'
})
export class BadgeUsersComponent extends Page implements OnDestroy {
    private _data: BadgeUsersModel;

    tableConfig: TableConfig;
    nickname: string;
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Add'})
    ];

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
            current: 'Manage badge users',
            items: [
                SITECP_BREADCRUMB_ITEM,
                BADGE_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    save (): void {
        const userIds = this._data.users.map(user => user.userId);
        this._httpService.put(`admin/badges/${this._data.badge.badgeId}/users`, {userIds: userIds})
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Users with this badge are now updated!'
                }));
                this.createOrUpdateTable();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    onRemove (action: Action): void {
        this._data.users = this._data.users.filter(item => item.userId !== Number(action.rowId));
        this.save();
    }

    addUser (): void {
        const user = this._data.availableUsers
            .find(item => item.nickname.toLowerCase() === this.nickname.toLowerCase());
        if (!user) {
            this._notificationService.sendNotification(new NotificationMessage({
                message: `User with name "${this.nickname}" do not exist`,
                title: 'User do not exist',
                type: NotificationType.ERROR
            }));
            return;
        }

        this.nickname = '';
        this._data.users.push(user);
        this.save();
    }

    get users (): Array<BadgeUser> {
        return this._data.users.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'nickname'));
    }

    get title (): string {
        return `Manage users for badge: ${this._data.badge.name}`;
    }

    private onData (data: { data: BadgeUsersModel }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Users with badge',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.users.map(user => new TableRow({
            id: user.userId.toString(),
            cells: [
                new TableCell({title: user.nickname}),
                new TableCell({title: user.createdAt})
            ],
            actions: [
                new TableAction({title: 'Remove'})
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Nickname'}),
            new TableHeader({title: 'Timestamp'})
        ];
    }
}
