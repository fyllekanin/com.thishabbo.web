import { SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
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
import { UserListAction, UsersListPage } from './users-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { AuthService } from 'core/services/auth/auth.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { ManageThcComponent } from './manage-thc/manage-thc.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { UsersListService } from '../services/users-list.service';
import { QueryParameters } from 'core/services/http/http.model';
import { MergeUsersComponent } from './merge-users/merge-users.component';

@Component({
    selector: 'app-admin-users-list',
    templateUrl: 'users-list.component.html'
})
export class UsersListComponent extends Page implements OnDestroy {
    private _usersListPage: UsersListPage = new UsersListPage();
    private _filterTimer = null;
    private _filter: QueryParameters;
    private _actions: Array<TableAction> = [];

    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _componentFactory: ComponentFactoryResolver,
        private _dialogService: DialogService,
        private _service: UsersListService,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Manage Users',
            items: [SITECP_BREADCRUMB_ITEM]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onFilter(filter: QueryParameters): void {
        clearTimeout(this._filterTimer);

        this._filterTimer = setTimeout(() => {
            this._service.getUsers(filter)
                .subscribe(data => {
                    this._filter = filter;
                    this.onPage(data);
                });
        }, 200);
    }

    onAction(action: Action): void {
        switch (action.value) {
            case UserListAction.EDIT_USER_BASIC:
                this._router.navigateByUrl(`/admin/users/${action.rowId}/basic`);
                break;
            case UserListAction.EDIT_USER_GROUPS:
                this._router.navigateByUrl(`/admin/users/${action.rowId}/groups`);
                break;
            case UserListAction.MANAGE_BANS:
                this._router.navigateByUrl(`/admin/users/${action.rowId}/bans`);
                break;
            case UserListAction.MANAGE_THC:
                this.openThcDialog(action.rowId);
                break;
            case UserListAction.MERGE_USER:
                this.openMergeDialog(action.rowId);
                break;
        }
    }

    private openMergeDialog(userId: string): void {
        const user = this._usersListPage.users.find(item => item.userId === Number(userId));
        this._dialogService.openDialog({
            title: `Merge ${user.nickname} with another user`,
            component: this._componentFactory.resolveComponentFactory(MergeUsersComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Save',
                    callback: data => {
                        const srcNickname = data.swapUsers ? data.otherNickname : user.nickname;
                        const destNickname = data.swapUsers ? user.nickname : data.otherNickname;
                        this._service.mergeUsers(srcNickname, destNickname).subscribe(() => {
                            this._dialogService.closeDialog.bind(this._dialogService);
                            this._usersListPage.users = this._usersListPage.users
                                .filter(row => row.nickname !== srcNickname);
                            this.createOrUpdateTable();
                        });
                    }
                }),
            ],
            data: user.nickname
        });
    }


    private openThcDialog(userId: string): void {
        this.createOrUpdateTable();
        const user = this._usersListPage.users.find(item => item.userId === Number(userId));
        this._dialogService.openDialog({
            title: `Manage ${user.nickname} thc`,
            component: this._componentFactory.resolveComponentFactory(ManageThcComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Save',
                    callback: credits => {
                        this._service.updateUsersThc(user, this._dialogService, credits);
                    }
                })
            ],
            data: user.credits
        });
    }

    private onPage(data: { data: UsersListPage }): void {
        this._usersListPage = data.data;

        this.buildActions();
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._usersListPage.page,
            total: this._usersListPage.total,
            url: `/admin/users/page/:page`,
            params: this._filter
        });
    }

    private buildActions(): void {
        const adminPermissions = this._authService.adminPermissions;
        const actions = [
            {
                title: 'Edit User',
                value: UserListAction.EDIT_USER_BASIC,
                condition: adminPermissions.canEditUserBasic || adminPermissions.canEditUserAdvanced
            },
            {
                title: 'Edit User Groups',
                value: UserListAction.EDIT_USER_GROUPS,
                condition: adminPermissions.canEditUserAdvanced
            },
            { title: 'Manage Bans', value: UserListAction.MANAGE_BANS, condition: adminPermissions.canBanUser },
            { title: 'Manage THC', value: UserListAction.MANAGE_THC, condition: adminPermissions.canManageTHC },
            { title: 'Merge User', value: UserListAction.MERGE_USER, condition: adminPermissions.canMergeUsers }
        ];

        this._actions = actions.map(action => new TableAction({ title: action.title, value: action.value }));
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Users',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [
                new FilterConfig({
                    title: 'Nickname',
                    placeholder: 'Search for users',
                    key: 'nickname'
                }),
                new FilterConfig({
                    title: 'Habbo',
                    placeholder: 'Search for habbo',
                    key: 'habbo'
                })
            ]
        });
    }

    private getTableRows(): Array<TableRow> {
        const actions = [].concat(this._actions);
        return this._usersListPage.users.map(user => {
            return new TableRow({
                id: String(user.userId),
                cells: [
                    new TableCell({ title: user.nickname }),
                    new TableCell({ title: user.habbo || '' }),
                    new TableCell({ title: this.timeAgo(user.updatedAt) })
                ],
                actions: actions
            });
        });
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Nickname' }),
            new TableHeader({ title: 'Habbo' }),
            new TableHeader({ title: 'Last modified' })
        ];
    }
}
