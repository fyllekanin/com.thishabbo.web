import { TitleTab } from 'shared/app-views/title/title.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
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
        new TableAction({ title: 'Edit Badge', value: BadgeListActions.EDIT_BADGE }),
        new TableAction({ title: 'Manage Users', value: BadgeListActions.MANAGE_USERS }),
        new TableAction({ title: 'Delete Badge', value: BadgeListActions.DELETE_BADGE })
    ];

    tabs: Array<TitleTab> = [new TitleTab({ title: 'New Badge', link: '/admin/badges/new' })];
    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor(
        private _globalNotificationService: GlobalNotificationService,
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

    ngOnDestroy(): void {
        super.destroy();
    }

    onAction(action: Action): void {
        switch (action.value) {
            case BadgeListActions.EDIT_BADGE:
                this._router.navigateByUrl(`/admin/badges/${action.rowId}`);
                break;
            case BadgeListActions.DELETE_BADGE:
                const bdg = this._badgesListPage.badges.find(badge => badge.badgeId.toString() === action.rowId);
                this._dialogService.openConfirmDialog(
                    `Delete badge`,
                    `Are you sure that you want to delete the badge ${bdg.name}?`,
                    this.onDelete.bind(this, action.rowId)
                );
                break;
            case BadgeListActions.MANAGE_USERS:
                this._router.navigateByUrl(`/admin/badges/${action.rowId}/users`);
                break;
        }
    }

    onFilter(filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filterTimer = setTimeout(() => {
            this._httpService.get(`admin/badges/list/page/1`, filter)
                .subscribe(data => {
                    this._filter = filter;
                    this.onPage({ data: new BadgesListPage(data) });
                });
        }, 200);
    }

    private onDelete(badgeId: number): void {
        this._httpService.delete(`admin/badges/${badgeId}`)
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Badge deleted!'
                }));
                this._badgesListPage.badges = this._badgesListPage.badges.filter(badge => badge.badgeId !== String(badgeId));
                this.createOrUpdateTable();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService), () => {
                this._dialogService.closeDialog();
            });
    }

    private onPage(data: { data: BadgesListPage }): void {
        this._badgesListPage = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._badgesListPage.page,
            total: this._badgesListPage.total,
            url: `/admin/badges/page/:page`,
            params: this._filter
        });
    }

    private createOrUpdateTable(): void {
        this.tableConfig = new TableConfig({
            title: 'Badges',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [new FilterConfig({
                title: 'Filter',
                placeholder: 'Search for badges',
                key: 'filter'
            })]
        });
    }

    private getTableRows(): Array<TableRow> {
        return this._badgesListPage.badges.map(badge => {
            return new TableRow({
                id: badge.badgeId,
                cells: [
                    new TableCell({
                        title: `<img appLazyLoad [image]="'/rest/resources/images/badges/${badge.badgeId}.gif?${badge.updatedAt}'" />`
                    }),
                    new TableCell({ title: badge.name }),
                    new TableCell({ title: badge.description }),
                    new TableCell({ title: this.timeAgo(badge.updatedAt) })
                ],
                actions: this._actions
            });
        });
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Icon' }),
            new TableHeader({ title: 'Name' }),
            new TableHeader({ title: 'Description' }),
            new TableHeader({ title: 'Last modified' })
        ];
    }
}
