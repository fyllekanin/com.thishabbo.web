import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BetActions, BetModel, BetsListPage, BetStatuses } from '../bets.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import {
    Action,
    FilterConfig,
    FilterConfigItem,
    FilterConfigType,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { ResultComponent } from './result/result.component';
import { isAbsent } from 'shared/helpers/class.helper';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-sitecp-betting-bets-list',
    templateUrl: 'bet-list.component.html'
})
export class BetListComponent extends Page implements OnDestroy {
    private _data: BetsListPage;
    private _filterTimer;
    private _filter: QueryParameters;

    tableConfig: TableConfig;
    pagination: PaginationModel;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Create Bet', link: '/sitecp/betting/bets/new' })
    ];

    constructor (
        private _componentFactory: ComponentFactoryResolver,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        private _router: Router,
        private _httpService: HttpService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Bets',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onFilter (filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._httpService.get(`sitecp/betting/bets/1`, filter)
                .subscribe(res => {
                    this.onData({ data: new BetsListPage(res) });
                });
        }, 200);
    }

    onAction (action: Action): void {
        const row = this.tableConfig.rows.find(item => item.id === action.rowId);
        const model = this._data.bets.find(bet => bet.betId === Number(row.id));
        switch (action.value) {
            case BetActions.SET_RESULT:
                this.openResultDialog(model);
                break;
            case BetActions.EDIT_BET:
                this._router.navigateByUrl(`/sitecp/betting/bets/${row.id}`);
                break;
            case BetActions.DELETE_BET:
                this._dialogService.confirm({
                    title: `Deleting ${model.name}`,
                    content: `Are you sure you want to delete ${model.name}?`,
                    callback: this.doDelete.bind(this, model)
                });
                break;
            case BetActions.SUSPEND_BET:
                this._httpService.put(`sitecp/betting/bet/${action.rowId}/suspend`)
                    .subscribe(() => {
                        const bet = this._data.bets.find(item => item.betId === Number(action.rowId));
                        bet.isSuspended = true;
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Bet is suspended'
                        }));
                        this.createOrUpdateTable();
                    }, this._notificationService.failureNotification.bind(this._notificationService));
                break;
            case BetActions.UNSUSPEND_BET:
                this._httpService.put(`sitecp/betting/bet/${action.rowId}/unsuspend`)
                    .subscribe(() => {
                        const bet = this._data.bets.find(item => item.betId === Number(action.rowId));
                        bet.isSuspended = false;
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Bet is unsuspended'
                        }));
                        this.createOrUpdateTable();
                    }, this._notificationService.failureNotification.bind(this._notificationService));
                break;
        }
    }

    private openResultDialog (model: BetModel): void {
        this._dialogService.openDialog({
            title: `Set Result on bet: ${model.name}`,
            component: this._componentFactory.resolveComponentFactory(ResultComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({ title: 'Done', callback: this.setResult.bind(this) })
            ],
            data: model
        });
    }

    private setResult (model: BetModel): void {
        if (isAbsent(model.result)) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Error',
                message: 'You need to choose win or loss',
                type: NotificationType.ERROR
            }));
            return;
        }

        this._httpService.put(`sitecp/betting/bet/${model.betId}/result`, { result: Boolean(model.result) })
            .subscribe(res => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Bet finished!'
                }));
                const index = this._data.bets.findIndex(item => item.betId === Number(model.betId));
                this._data.bets[index] = new BetModel(res);
                this.createOrUpdateTable();
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private doDelete (bet: BetModel): void {
        this._httpService.delete(`sitecp/betting/bet/${bet.betId}`)
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `${bet.name} is deleted!`
                }));
                this._data.bets = this._data.bets
                    .filter(item => item.betId !== bet.betId);
                this.createOrUpdateTable();
            }, error => {
                this._notificationService.failureNotification(error);
            }, () => {
                this._dialogService.closeDialog();
            });
    }

    private onData (data: { data: BetsListPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: `/sitecp/betting/bets/page/:page`,
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Bets',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [
                new FilterConfig({
                    title: 'Filter',
                    placeholder: 'Filter on bet name...',
                    key: 'filter'
                }),
                new FilterConfig({
                    title: 'Status',
                    key: 'status',
                    type: FilterConfigType.SELECT,
                    items: [
                        new FilterConfigItem({ label: 'Suspended', value: BetStatuses.SUSPENDED }),
                        new FilterConfigItem({ label: 'Finished', value: BetStatuses.FINISHED }),
                        new FilterConfigItem({ label: 'Ongoing', value: BetStatuses.ONGOING })
                    ]
                })
            ]
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.bets.map(bet => {
            const actions = [
                { title: 'Edit', value: BetActions.EDIT_BET, condition: true },
                { title: 'Set Result', value: BetActions.SET_RESULT, condition: !bet.isFinished },
                { title: 'Suspend', value: BetActions.SUSPEND_BET, condition: !bet.isSuspended && !bet.isFinished },
                { title: 'Unsuspend', value: BetActions.UNSUSPEND_BET, condition: bet.isSuspended && !bet.isFinished },
                { title: 'Delete', value: BetActions.DELETE_BET, condition: true }
            ];
            return new TableRow({
                id: String(bet.betId),
                cells: [
                    new TableCell({ title: bet.name }),
                    new TableCell({ title: bet.isFinished ? 'Finished' : (bet.isSuspended ? 'Suspended' : 'Ongoing') }),
                    new TableCell({ title: `${bet.leftSide}/${bet.rightSide}` }),
                    new TableCell({ title: String(bet.displayOrder) })
                ],
                actions: actions.filter(action => action.condition)
                    .map(action => new TableAction(action))
            });
        });
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Name' }),
            new TableHeader({ title: 'Status' }),
            new TableHeader({ title: 'Odds' }),
            new TableHeader({ title: 'Display Order' })
        ];
    }
}
