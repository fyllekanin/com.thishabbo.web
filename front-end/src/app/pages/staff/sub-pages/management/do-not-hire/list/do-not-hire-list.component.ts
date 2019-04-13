import { Component, ElementRef, OnDestroy } from '@angular/core';
import { STAFFCP_BREADCRUM_ITEM, STAFFCP_MANAGEMENT_BREADCRUMB_ITEM } from '../../../../staff.constants';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { DoNotHireModel, DoNotHireActions } from '../do-not-hire.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { TableCell, TableConfig, TableHeader, TableRow, TableAction, Action } from 'shared/components/table/table.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-staff-management-do-not-hire-list',
    templateUrl: 'do-not-hire-list.component.html',
    styleUrls: ['do-not-hire-list.component.css']
})
export class DoNotHireListComponent extends Page implements OnDestroy {
    private _data = new DoNotHireModel();
    private _actions: Array<TableAction> = [
        new TableAction({ title: 'Edit', value: DoNotHireActions.EDIT_DNH_ENTRY }),
        new TableAction({ title: 'Delete', value: DoNotHireActions.DELETE_DNH_ENTRY })
    ];

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'New Entry', link: '/staff/management/do-not-hire/new' })
    ];
    tableConfig: TableConfig;

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
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Do Not Hire List',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                STAFFCP_MANAGEMENT_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onAction(action: Action): void {
        switch (action.value) {
            case DoNotHireActions.DELETE_DNH_ENTRY:
                this.delete(action.rowId);
                break;
            case DoNotHireActions.EDIT_DNH_ENTRY:
                this._router.navigateByUrl(`/staff/management/do-not-hire/${action.rowId}`);
                break;
        }
    }

    private delete(rowId: string): void {
        this._dialogService.openConfirmDialog(
            `Deleting DNH Entry`,
            `Are you sure that you wanna delete this?`,
            this.onDelete.bind(this, rowId)
        );
    }

    private onDelete(nickname: string): void {
        this._httpService.delete(`staff/management/do-not-hire/${nickname}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Entry deleted!'
                }));
                this._data.items = this._data.items.filter(item => nickname !== item.nickname);
                this.createOrUpdateTable();
            }, this._notificationService.failureNotification.bind(this._notificationService), () => {
                this._dialogService.closeDialog();
            });
    }

    private onData(data: { data: DoNotHireModel }): void {
        this._data = data.data;

        this.createOrUpdateTable();
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: `Do Not Hire List`,
            headers: DoNotHireListComponent.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows(): Array<TableRow> {
        const actions = [].concat(this._actions);
        return this._data.items.map(item => {
            return new TableRow({
                id: item.nickname,
                cells: [
                    new TableCell({ title: item.nickname }),
                    new TableCell({ title: item.reason }),
                    new TableCell({ title: item.addedBy }),
                    new TableCell({ title: TimeHelper.getLongDateWithTime(item.createdAt) })
                ],
                actions: actions
            });
        });
    }

    private static getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Name' }),
            new TableHeader({ title: 'Reason' }),
            new TableHeader({ title: 'Added By' }),
            new TableHeader({ title: 'Added On' })
        ];
    }
}
