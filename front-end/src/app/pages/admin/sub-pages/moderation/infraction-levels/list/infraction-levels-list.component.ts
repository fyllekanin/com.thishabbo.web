import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InfractionLevelsActions, InfractionLevelsListPage } from './infraction-levels-list.model';
import { QueryParameters } from 'core/services/http/http.model';
import {
    Action,
    FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../../admin.constants';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { InfractionLevelsService } from '../../services/infraction-levels.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-admin-moderation-infraction-levels-list',
    templateUrl: 'infraction-levels-list.component.html'
})
export class InfractionLevelsListComponent extends Page implements OnDestroy {
    private _page: InfractionLevelsListPage;
    private _filterTimer = null;
    private _filter: QueryParameters;

    tableConfig: TableConfig;
    pagination: PaginationModel;

    tabs: Array<TitleTab> = [
        new TitleTab({
            title: 'Create New',
            link: 'admin/moderation/infraction-levels/new'
        })
    ];

    constructor(
        private _dialogService: DialogService,
        private _httpService: HttpService,
        private _router: Router,
        private _service: InfractionLevelsService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Infraction Levels List',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onFilter(filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._service.getData(filter, 1)
                .subscribe(data => {
                    this.onData({ data: data });
                });
        }, 200);
    }

    onAction(action: Action): void {
        switch (action.value) {
            case InfractionLevelsActions.EDIT:
                this._router.navigateByUrl(`/admin/moderation/infraction-levels/${action.rowId}`);
                break;
            case InfractionLevelsActions.DELETE:
                const level = this._page.items.find(item => item.infractionLevelId === Number(action.rowId));
                this._dialogService.openConfirmDialog(
                    'Are you sure?',
                    `Are you sure you wanna delete infraction level: ${level.title}?`,
                    () => {
                        this._httpService.delete(`admin/moderation/infraction-levels/${action.rowId}`)
                            .subscribe(() => {
                                this._notificationService.sendNotification(new NotificationModel({
                                    title: 'Success',
                                    message: 'Infraction level deleted'
                                }));
                                this._page.items = this._page.items
                                    .filter(item => item.infractionLevelId !== Number(action.rowId));
                                this.buildTableConfig();
                                this._dialogService.closeDialog();
                            }, this._notificationService.failureNotification.bind(this._notificationService));
                    }
                );
                break;
        }
    }

    private onData(data: { data: InfractionLevelsListPage }): void {
        this._page = data.data;
        this.buildTableConfig();

        this.pagination = new PaginationModel({
            page: this._page.page,
            total: this._page.total,
            url: `/admin/moderation/infraction-levels/page/:page`,
            params: this._filter
        });
    }

    private buildTableConfig(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Infraction Levels',
            headers: InfractionLevelsListComponent.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [new FilterConfig({
                title: 'Filter',
                placeholder: 'Search for automatic bans',
                key: 'filter'
            })]
        });
    }

    private getTableRows(): Array<TableRow> {
        const actions = [
            new TableAction({ title: 'Edit', value: InfractionLevelsActions.EDIT }),
            new TableAction({ title: 'Delete', value: InfractionLevelsActions.DELETE })
        ];
        return this._page.items.map(item => new TableRow({
            id: String(item.infractionLevelId),
            cells: [
                new TableCell({ title: item.title }),
                new TableCell({ title: String(item.points) }),
                new TableCell({ title: InfractionLevelsListComponent.getTime(item.lifeTime) }),
                new TableCell({ title: item.categoryId ? 'Thread' : 'Notification Only' })
            ],
            actions: actions
        }));
    }

    private static getTime(lifeTime: number): string {
        if (lifeTime < 0) {
            return 'Is persisted';
        }

        if (lifeTime < 3600) {
            return `${lifeTime / 60} minute(s)`;
        } else if (lifeTime < 86400) {
            return `${lifeTime / 3600} hour(s)`;
        } else {
            return `${lifeTime / 86400} day(s)`;
        }
    }

    private static getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Title' }),
            new TableHeader({ title: 'Points' }),
            new TableHeader({ title: 'Life Time' }),
            new TableHeader({ title: 'Type' })
        ];
    }
}
