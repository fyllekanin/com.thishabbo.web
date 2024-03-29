import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { BansPage, BansPageAction } from './bans.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from 'app/pages/sitecp/sitecp.constants';
import {
    Action,
    FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { BansPageService } from '../services/bans.service';
import { TimeHelper } from 'shared/helpers/time.helper';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { IReason } from 'shared/components/reason/reason.model';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { ReasonComponent } from 'shared/components/reason/reason.component';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-sitecp-bans',
    templateUrl: './bans.component.html'
})
export class BansComponent extends Page implements OnDestroy {
    private _bansPage = new BansPage();
    private _filterTimer = null;
    private _filter: QueryParameters;
    private _actions: Array<TableAction> = [
        new TableAction({ title: 'Lift Ban', value: BansPageAction.LIFT_BAN }),
        new TableAction({ title: 'View User Bans', value: BansPageAction.VIEW_BANS })
    ];

    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor (
        private _router: Router,
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        private _componentFactory: ComponentFactoryResolver,
        private _service: BansPageService,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onPage.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Banned Users',
            items: [ SITECP_BREADCRUMB_ITEM ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onFilter (filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._service.getBans(filter, 1)
                .subscribe(data => {
                    this.onPage({ data: data });
                });
        }, 200);
    }

    onAction (action: Action): void {
        switch (action.value) {
            case BansPageAction.LIFT_BAN:
                this.onLiftBan(action.rowId);
                break;
            case BansPageAction.VIEW_BANS:
                this.onViewBans(action.rowId);
                break;
        }
    }

    private onLiftBan (banId: string): void {
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

    private doLift (banId: number, userId: number, reason: IReason): void {
        if (!reason.reason) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Error',
                message: 'You need to set a reason',
                type: NotificationType.ERROR
            }));
            return;
        }

        this._service.liftBan(userId, banId, reason).subscribe(() => {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Success',
                message: `Ban lifted!`
            }));

            this._bansPage.bans = this._bansPage.bans.filter(item => item.banId !== Number(banId));
            this.createOrUpdateTable();
            this._dialogService.closeDialog.bind(this._dialogService);
        }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onViewBans (banId: string): void {
        const userId = this._bansPage.bans.find(ban => ban.banId === Number(banId)).banned.userId;
        this._router.navigateByUrl(`sitecp/users/${userId}/bans`);
    }

    private onPage (data: { data: BansPage }): void {
        this._bansPage = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._bansPage.page,
            total: this._bansPage.total,
            url: '/sitecp/bans/page/:page',
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
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
                    placeholder: 'Search for user...',
                    key: 'nickname'
                })
            ]
        });
    }


    private getTableRows (): Array<TableRow> {
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

    private static getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Banned' }),
            new TableHeader({ title: 'Banner' }),
            new TableHeader({ title: 'Reason' }),
            new TableHeader({ title: 'Expiry' })
        ];
    }

    private static getTime (expiresAt: number): string {
        return expiresAt === 0 ? 'Never' : TimeHelper.getLongDateWithTime(expiresAt);
    }

}
