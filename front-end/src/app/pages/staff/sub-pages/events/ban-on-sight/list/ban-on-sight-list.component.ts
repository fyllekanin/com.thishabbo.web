import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { STAFFCP_BREADCRUM_ITEM, STAFFCP_EVENTS_BREADCRUM_ITEM } from '../../../../staff.constants';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { BanOnSightActions, BanOnSightItem } from '../ban-on-sight.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { AuthService } from 'core/services/auth/auth.service';

@Component({
    selector: 'app-staff-ban-on-sight-list',
    templateUrl: './ban-on-sight-list.component.html',
    styleUrls: ['./ban-on-sight-list.component.css']
})

export class BanOnSightListComponent extends Page implements OnDestroy, OnInit {
    private _data: Array<BanOnSightItem> = [];
    private _actions: Array<TableAction> = [
        new TableAction({title: 'Edit', value: BanOnSightActions.EDIT_BOS_ENTRY}),
        new TableAction({title: 'Delete', value: BanOnSightActions.DELETE_BOS_ENTRY})
    ];
    tabs: Array<TitleTab> = [];
    tableConfig: TableConfig;

    constructor (
        private _authService: AuthService,
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _router: Router,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Ban On Sight',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                STAFFCP_EVENTS_BREADCRUM_ITEM
            ]
        });
    }

    ngOnInit (): void {
        this.tabs = !this._authService.staffPermissions.canManageBanOnSight ? [] : [
            new TitleTab({title: 'New Entry', link: '/staff/events/ban-on-sight/new'})
        ];
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: Action): void {
        switch (action.value) {
            case BanOnSightActions.DELETE_BOS_ENTRY:
                this.delete(Number(action.rowId));
                break;
            case BanOnSightActions.EDIT_BOS_ENTRY:
                this._router.navigateByUrl(`/staff/events/ban-on-sight/${action.rowId}`);
                break;
        }
    }

    private delete (rowId: number): void {
        this._dialogService.confirm({
            title: `Deleting BOS Entry`,
            content: `Are you sure that you want to delete this?`,
            callback: this.onDelete.bind(this, rowId)
        });
    }

    private onDelete (entryId: number): void {
        this._httpService.delete(`staff/events/ban-on-sight/${entryId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Entry has been deleted!'
                }));
                this._data = this._data.filter(item => entryId !== item.id);
                this.createOrUpdateTable();
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private onData (data: { data: Array<BanOnSightItem> }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: `Ban On Sight List`,
            headers: BanOnSightListComponent.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.map(item => {
            return new TableRow({
                id: item.id.toString(),
                cells: [
                    new TableCell({title: item.name}),
                    new TableCell({title: item.reason}),
                    new TableCell({title: item.addedBy}),
                    new TableCell({title: TimeHelper.getTime(item.createdAt)})
                ],
                actions: this._authService.staffPermissions.canManageBanOnSight ? this._actions : []
            });
        });
    }

    private static getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Name'}),
            new TableHeader({title: 'Reason'}),
            new TableHeader({title: 'Added By'}),
            new TableHeader({title: 'Added On'})
        ];
    }
}
