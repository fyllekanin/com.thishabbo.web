import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_ITEMS_BREADCRUMB_ITEMS, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { ItemUserModel, ItemUsersPage } from './item-users.model';
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

@Component({
    selector: 'app-sitecp-shop-item-users',
    templateUrl: 'item-users.component.html'
})
export class ItemUsersComponent extends Page implements OnDestroy {
    private _data: ItemUsersPage;

    tableConfig: TableConfig;
    nicknames: string;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Add' }),
        new TitleTab({ title: 'Back', link: SHOP_ITEMS_BREADCRUMB_ITEMS.url })
    ];

    constructor (
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
            current: 'Manage Users',
            items: [
                SITECP_BREADCRUMB_ITEM,
                SHOP_ITEMS_BREADCRUMB_ITEMS
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onAdd (): void {
        this._httpService.post(`sitecp/shop/items/${this._data.itemId}/users`, {
            nicknames: this.nicknames.split(',').map(item => item.trim())
        }).subscribe(items => {
            this.nicknames = null;
            (items || []).forEach(item => this._data.items.push(new ItemUserModel(item)));
            this._notificationService.sendInfoNotification('Item given!');
            this.createOrUpdateTable();
        }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    onAction (action: Action): void {
        this._dialogService.confirm({
            title: 'Are you sure?',
            content: 'Are you sure you wanna remove item from this person?',
            callback: () => {
                this._httpService.delete(`sitecp/shop/items/users/${action.rowId}`)
                    .subscribe(() => {
                        this._notificationService.sendInfoNotification('Item removed');
                        this._data.items = this._data.items.filter(item => item.userItemId !== Number(action.rowId));
                        this.createOrUpdateTable();
                        this._dialogService.closeDialog();
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }

    private onData (data: { data: ItemUsersPage }): void {
        this._data = data.data;

        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Users with item',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            id: String(item.userItemId),
            cells: [
                new TableCell({ title: item.user.nickname }),
                new TableCell({ title: item.createdAt })
            ],
            actions: [
                new TableAction({ title: 'Remove' })
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Nickname' }),
            new TableHeader({ title: 'Timestamp' })
        ];
    }
}
