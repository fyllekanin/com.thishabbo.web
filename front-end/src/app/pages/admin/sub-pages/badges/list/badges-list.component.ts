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
import { BadgeListActions, BadgesListPage } from './badges-list.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';
import { HttpService } from 'core/services/http/http.service';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-badges-list',
    templateUrl: 'badges-list.component.html'
})
export class BadgesListComponent extends Page implements OnDestroy {
    private _badgesListPage: BadgesListPage = new BadgesListPage();
    private _filterTimer: NodeJS.Timer = null;
    private _filter: QueryParameters;
    private _actions: Array<TableAction> = [
        new TableAction({title: 'Edit Badge', value: BadgeListActions.EDIT_BADGE}),
        new TableAction({title: 'Manage Users', value: BadgeListActions.MANAGE_USERS}),
        new TableAction({title: 'Delete Badge', value: BadgeListActions.DELETE_BADGE})
    ];

    tabs: Array<TitleTab> = [new TitleTab({title: 'New Badge', link: '/admin/badges/new'})];
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
            current: 'Manage Badges',
            items: [SITECP_BREADCRUMB_ITEM]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: Action): void {
        switch (action.value) {
            case BadgeListActions.EDIT_BADGE:
                this._router.navigateByUrl(`/admin/badges/${action.rowId}`);
                break;
            case BadgeListActions.DELETE_BADGE:
                const badge = this._badgesListPage.badges.find(item => item.badgeId.toString() === action.rowId);
                this._dialogService.confirm({
                    title: `Delete badge`,
                    content: `Are you sure that you want to delete the badge ${badge.name}?`,
                    callback: this.onDelete.bind(this, action.rowId)
                });
                break;
            case BadgeListActions.MANAGE_USERS:
                this._router.navigateByUrl(`/admin/badges/${action.rowId}/users`);
                break;
        }
    }

    onFilter (filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._httpService.get(`admin/badges/list/page/1`, filter)
                .subscribe(data => {
                    this.onPage({data: new BadgesListPage(data)});
                });
        }, 200);
    }

    private onDelete (badgeId: number): void {
        this._httpService.delete(`admin/badges/${badgeId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Badge deleted!'
                }));
                this._badgesListPage.badges = this._badgesListPage.badges.filter(badge => badge.badgeId !== String(badgeId));
                this.createOrUpdateTable();
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private onPage (data: { data: BadgesListPage }): void {
        this._badgesListPage = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._badgesListPage.page,
            total: this._badgesListPage.total,
            url: `/admin/badges/page/:page`,
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Badges',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [new FilterConfig({
                title: 'Filter',
                placeholder: 'Search for badge...',
                key: 'filter'
            })]
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._badgesListPage.badges.map(badge => {
            return new TableRow({
                id: badge.badgeId,
                cells: [
                    new TableCell({
                        title: `<img src="/rest/resources/images/badges/${badge.badgeId}.gif?${badge.updatedAt}" />`
                    }),
                    new TableCell({title: badge.name}),
                    new TableCell({title: badge.description}),
                    new TableCell({title: this.timeAgo(badge.updatedAt)})
                ],
                actions: this._actions
            });
        });
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Icon'}),
            new TableHeader({title: 'Name'}),
            new TableHeader({title: 'Description'}),
            new TableHeader({title: 'Last modified'})
        ];
    }
}
