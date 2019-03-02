import { Component, OnDestroy, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { BansPage, BansPageAction } from './bans.model';
import { QueryParameters } from 'core/services/http/http.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from 'app/pages/admin/admin.constants';
import {
    FilterConfig,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow,
    TableAction,
    Action
} from 'shared/components/table/table.model';
import { BansPageService } from '../services/bans.service';
import { TimeHelper } from 'shared/helpers/time.helper';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { IReason } from 'shared/components/reason/reason.model';
import { DialogCloseButton, DialogButton } from 'shared/app-views/dialog/dialog.model';
import { ReasonComponent } from 'shared/components/reason/reason.component';

@Component({
    selector: 'app-admin-bans',
    templateUrl: './bans.component.html',
    styleUrls: ['./bans.component.css']
})
export class BansComponent extends Page implements OnDestroy {
    private _bansPage = new BansPage();
    private _filterTimer = null;
    private _filter: QueryParameters;
    private _actions: Array<TableAction> = [
        new TableAction ({ title: 'Lift Ban', value: BansPageAction.LIFT_BAN}),
        new TableAction ({ title: 'View User Bans', value: BansPageAction.VIEW_BANS})
    ];

    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor(
        private _router: Router,
        private _dialogService: DialogService,
        private _globalNotificationService: GlobalNotificationService,
        private _componentFactory: ComponentFactoryResolver,
        private _service: BansPageService,
        breadcrumService: BreadcrumbService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumService.breadcrumb = new Breadcrumb({
            current: 'Banned Users',
            items: [SITECP_BREADCRUMB_ITEM]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onFilter(filter: QueryParameters): void {
        clearTimeout(this._filterTimer);

        this._filterTimer = setTimeout(() => {
            this._service.getBans(filter, 1)
                .subscribe(data => {
                    this._filter = filter;
                    this.onPage(data);
                });
        }, 200);
    }

    onAction(action: Action): void {
        switch (action.value) {
            case BansPageAction.LIFT_BAN:
                this.onLiftBan(action.rowId);
                break;
            case BansPageAction.VIEW_BANS:
                this.onViewBans(action.rowId);
                break;
        }
    }

    private onLiftBan(banId: string): void {
        const user = this._bansPage.bans.find(ban => ban.banId === Number(banId)).banned;
        this._dialogService.openDialog({
            title: `Lifting ban on ${user.nickname}`,
            component: this._componentFactory.resolveComponentFactory(ReasonComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({ title: 'Lift', callback: this.doLift.bind(this, banId, user.userId) })
            ],
            data: { isBanning: false }
        });
    }

    private doLift(banId: number, userId: number, reason: IReason): void {
        if (!reason.reason) {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Error',
                message: 'You need to set a reason',
                type: NotificationType.ERROR
            }));
            return;
        }

        this._service.liftBan(userId, banId, reason).subscribe(() => {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Success',
                message: `Ban lifted!`
            }));

            this._bansPage.bans = this._bansPage.bans.filter(item => item.banId !== Number(banId));
            this.createOrUpdateTable();
            this._dialogService.closeDialog.bind(this._dialogService);
        }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onViewBans(banId: string): void {
        const userId = this._bansPage.bans.find(ban => ban.banId === Number(banId)).banned.userId;
        this._router.navigateByUrl(`admin/users/${userId}/bans`);
    }

    private onPage(data: BansPage ): void {
        this._bansPage = data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._bansPage.page,
            total: this._bansPage.total,
            url: '/admin/bans/page/:page',
            params: this._filter
        });
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Banned Users',
            headers: BansComponent.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [
                new FilterConfig({
                    title: 'Nickname',
                    placeholder: 'Search for user',
                    key: 'nickname'
                })
            ]
        });
    }


    private getTableRows(): Array<TableRow> {
        return this._bansPage.bans.map(ban => {
            return new TableRow({
                id: String(ban.banId),
                cells: [
                    new TableCell({ title: ban.banned.nickname }),
                    new TableCell({ title: ban.banner.nickname }),
                    new TableCell({ title: ban.reason }),
                    new TableCell({ title: BansComponent.getTime(ban.expiresAt) })
                ],
                actions: this._actions
            });
        });
    }

    private static getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Banned' }),
            new TableHeader({ title: 'Banner' }),
            new TableHeader({ title: 'Reason' }),
            new TableHeader({ title: 'Expiry' })
        ];
    }

    private static getTime(expiresAt: number): string {
        return expiresAt === 0 ? 'Never' : TimeHelper.getLongDateWithTime(expiresAt);
    }

}
