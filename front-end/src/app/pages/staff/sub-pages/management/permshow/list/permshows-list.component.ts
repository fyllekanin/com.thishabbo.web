import { Component, ElementRef, OnDestroy } from '@angular/core';
import { PermShowActions, PermShowsListPage } from '../permshow.model';
import { Page } from 'shared/page/page.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import {
    STAFFCP_BREADCRUM_ITEM,
    STAFFCP_MANAGEMENT_BREADCRUMB_ITEM

} from 'app/pages/staff/staff.constants';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeHelper } from 'shared/helpers/time.helper';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';

@Component({
    selector: 'app-staff-management-permshow-list',
    templateUrl: './permshows-list.component.html'
})
export class PermShowsListComponent extends Page implements OnDestroy {
    private _permShowsListPage: PermShowsListPage = new PermShowsListPage();
    private _actions: Array<TableAction> = [
        new TableAction({ title: 'Edit', value: PermShowActions.EDIT_PERM_SHOW }),
        new TableAction({ title: 'Delete', value: PermShowActions.DELETE_PERM_SHOW })
    ];

    tabs: Array<TitleTab> = [new TitleTab({ title: 'New Permanent Show', link: '/staff/management/permanent-shows/new' })];
    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor(
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        private _router: Router,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Manage perm shows',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                STAFFCP_MANAGEMENT_BREADCRUMB_ITEM
            ]
        });
    }

    onAction(action: Action): void {
        switch (action.value) {
            case PermShowActions.DELETE_PERM_SHOW:
                this.delete(Number(action.rowId));
                break;
            case PermShowActions.EDIT_PERM_SHOW:
                this._router.navigateByUrl(`/staff/management/permanent-shows/${action.rowId}`);
                break;
        }
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Permanent Shows',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'DJ' }),
            new TableHeader({ title: 'Name' }),
            new TableHeader({ title: 'Day' }),
            new TableHeader({ title: 'Hour' })
        ];
    }

    private getTableRows(): Array<TableRow> {
        const actions = [].concat(this._actions);
        return this._permShowsListPage.permShows.map(item => {
            return new TableRow({
                id: String(item.timetableId),
                cells: [
                    new TableCell({ title: item.nickname }),
                    new TableCell({ title: item.name }),
                    new TableCell({ title: TimeHelper.getDay(item.day).label }),
                    new TableCell({ title: TimeHelper.getHours()[item.hour].label })
                ],
                actions: actions
            });
        });
    }

    private delete(rowId: number): void {
        this._dialogService.openConfirmDialog(
            `Deleting permanent show`,
            `Are you sure that you wanna delete this? You can just pause it this week by unbooking it`,
            this.onDelete.bind(this, rowId)
        );
    }

    private onDelete(permShowId: number): void {
        this._httpService.delete(`staff/management/permanent-shows/${permShowId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'Perm show deleted!'
                }));
                this._permShowsListPage.permShows = this._permShowsListPage.permShows.filter(item => permShowId !== item.timetableId);
                this.createOrUpdateTable();
            }, this._notificationService.failureNotification.bind(this._notificationService), () => {
                this._dialogService.closeDialog();
            });
    }


    private onPage(data: { data: PermShowsListPage }): void {
        this._permShowsListPage = data.data;
        this._permShowsListPage.permShows.forEach(item => {
            const convertedHour = item.hour + TimeHelper.getTimeOffsetInHours();
            item.hour = TimeHelper.getConvertedHour(convertedHour);
            item.day = TimeHelper.getConvertedDay(convertedHour, item.day);
        });
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._permShowsListPage.page,
            total: this._permShowsListPage.total,
            url: '/admin/groups/page/:page'
        });
    }
}
