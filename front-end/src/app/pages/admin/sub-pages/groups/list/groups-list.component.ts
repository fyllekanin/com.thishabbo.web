
import { TitleTab } from 'shared/app-views/title/title.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import {
    Action,
    FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupListActions, GroupsListPage } from './groups-list.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, CATEGORY_LIST_BREADCRUMB_ITEM } from '../../../admin.constants';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-groups-list',
    templateUrl: 'groups-list.component.html'
})
export class GroupsListComponent extends Page implements OnDestroy {
    private _groupsListPage: GroupsListPage = new GroupsListPage();
    private _filterTimer;
    private _filter: QueryParameters;
    private _actions: Array<TableAction> = [
        new TableAction({ title: 'Edit Group', value: GroupListActions.EDIT_GROUP }),
        new TableAction({ title: 'Delete Group', value: GroupListActions.DELETE_GROUP })
    ];

    tabs: Array<TitleTab> = [new TitleTab({ title: 'New Group', link: '/admin/groups/new' })];
    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor(
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        private _router: Router,
        private _httpService: HttpService,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: CATEGORY_LIST_BREADCRUMB_ITEM.title,
            items: [SITECP_BREADCRUMB_ITEM]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onAction(action: Action): void {
        switch (action.value) {
            case GroupListActions.EDIT_GROUP:
                this._router.navigateByUrl(`/admin/groups/${action.rowId}`);
                break;
            case GroupListActions.DELETE_GROUP:
                const grp = this._groupsListPage.groups.find(group => group.groupId.toString() === action.rowId);
                this._dialogService.openConfirmDialog(
                    `Deleting group`,
                    `Are you sure that you want to delete the group ${grp.name}?`,
                    this.onDelete.bind(this, action.rowId)
                );
                break;
        }
    }

    onFilter(filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._httpService.get(`admin/groups/list/page/1`, filter)
                .pipe(map(data => {
                    return { data: new GroupsListPage(data) };
                })).subscribe(this.onPage.bind(this));
        }, 200);
    }

    private onDelete(groupId: number): void {
        this._httpService.delete(`admin/groups/${groupId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'Group deleted!'
                }));
                this._groupsListPage.groups = this._groupsListPage.groups.filter(group => group.groupId !== Number(groupId));
                this.createOrUpdateTable();
            }, this._notificationService.failureNotification.bind(this._notificationService), () => {
                this._dialogService.closeDialog();
            });
    }

    private onPage(data: { data: GroupsListPage }): void {
        this._groupsListPage = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._groupsListPage.page,
            total: this._groupsListPage.total,
            url: `/admin/groups/page/:page`,
            params: this._filter
        });
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Groups',
            headers: GroupsListComponent.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [new FilterConfig({
                title: 'Filter',
                placeholder: 'Search for groups',
                key: 'filter'
            })]
        });
    }

    private getTableRows(): Array<TableRow> {
        return this._groupsListPage.groups.map(group => {
            return new TableRow({
                id: String(group.groupId),
                cells: [
                    new TableCell({ title: group.name }),
                    new TableCell({ title: (group.immunity || 0).toString() }),
                    new TableCell({ title: this.timeAgo(group.updatedAt) })
                ],
                actions: this._actions
            });
        });
    }

    private static getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Name' }),
            new TableHeader({ title: 'Immunity' }),
            new TableHeader({ title: 'Last modified' })
        ];
    }
}
