import { TitleTab } from 'shared/app-views/title/title.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
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
import { CATEGORY_LIST_BREADCRUMB_ITEM, SITECP_BREADCRUMB_ITEM } from '../../../sitecp.constants';
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
        new TableAction({ title: 'View Forum Permissions', value: GroupListActions.VIEW_FORUM_PERMISSIONS }),
        new TableAction({ title: 'Delete Group', value: GroupListActions.DELETE_GROUP })
    ];

    tabs: Array<TitleTab> = [ new TitleTab({ title: 'New Group', link: '/sitecp/groups/new' }) ];
    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor (
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
            items: [ SITECP_BREADCRUMB_ITEM ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: Action): void {
        switch (action.value) {
            case GroupListActions.EDIT_GROUP:
                this._router.navigateByUrl(`/sitecp/groups/${action.rowId}`);
                break;
            case GroupListActions.VIEW_FORUM_PERMISSIONS:
                this._router.navigateByUrl(`/sitecp/groups/${action.rowId}/forum-permissions`);
                break;
            case GroupListActions.DELETE_GROUP:
                const group = this._groupsListPage.groups.find(item => item.groupId.toString() === action.rowId);
                this._dialogService.confirm({
                    title: `Deleting group`,
                    content: `Are you sure that you want to delete the group ${group.name}?`,
                    callback: this.onDelete.bind(this, action.rowId)
                });
                break;
        }
    }

    onFilter (filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._httpService.get(`sitecp/groups/list/page/1`, filter)
                .pipe(map(data => {
                    return { data: new GroupsListPage(data) };
                })).subscribe(this.onPage.bind(this));
        }, 200);
    }

    private onDelete (groupId: number): void {
        this._httpService.delete(`sitecp/groups/${groupId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Group deleted!'
                }));
                this._groupsListPage.groups = this._groupsListPage.groups.filter(group => group.groupId !== Number(groupId));
                this.createOrUpdateTable();
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private onPage (data: { data: GroupsListPage }): void {
        this._groupsListPage = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._groupsListPage.page,
            total: this._groupsListPage.total,
            url: `/sitecp/groups/page/:page`,
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Usergroups',
            headers: GroupsListComponent.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [ new FilterConfig({
                title: 'Filter',
                placeholder: 'Search for usergroup...',
                key: 'filter'
            }) ]
        });
    }

    private getTableRows (): Array<TableRow> {
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

    private static getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Name' }),
            new TableHeader({ title: 'Immunity' }),
            new TableHeader({ title: 'Last modified' })
        ];
    }
}
