import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { Bet, BetCategory, BetDashboardListActions, DashboardModel } from './dashboard.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { TitleTab } from 'shared/app-views/title/title.model';
import { DashboardService } from '../services/dashboard.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BETTING_HUB } from '../betting.constants';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { getBettingStats } from '../betting.model';

@Component({
    selector: 'app-betting-dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends Page implements OnInit, OnDestroy {
    private _data: DashboardModel = new DashboardModel();
    private _contractedSections: Array<number> = [];
    private _sectionTables: Array<TableConfig> = [];
    private _placeBet: Array<TableAction> = [
        new TableAction({ title: 'Place Bet', value: BetDashboardListActions.PLACE_BET })
    ];
    private _betSuspended: Array<TableAction> = [
        new TableAction({ title: 'Suspended', isDisabled: true })
    ];

    trendingTable: TableConfig;
    toggleTab: Array<TitleTab> = [
        new TitleTab({ title: 'Toggle' })
    ];

    stats: Array<StatsBoxModel> = [];

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dashboardService: DashboardService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Dashboard',
            items: [
                BETTING_HUB
            ]
        });
    }

    ngOnInit(): void {
        this._contractedSections = this.getContractedSections();
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    getTableConfig(category: BetCategory): TableConfig {
        return this._sectionTables.find(section => section.id === category.betCategoryId);
    }

    onToggle(betCategoryId: number): void {
        if (this.isContracted(betCategoryId)) {
            this._contractedSections = this._contractedSections.filter(section => section !== betCategoryId);
        } else {
            this._contractedSections.push(betCategoryId);
        }
        this.updateContractedSections();
    }

    isContracted(betCategoryId: number): boolean {
        return this._contractedSections.indexOf(betCategoryId) > -1;
    }

    onAction(action: Action, betCategoryId?: number): void {
        let bet;
        if (betCategoryId) {
            bet = this._data.activeBets.find(category => category.betCategoryId === betCategoryId)
                .activeBets.find(item => item.betId === Number(action.rowId));
        } else {
            bet = this._data.trendingBets.find(item => item.betId === Number(action.rowId));
        }
        switch (action.value) {
            case BetDashboardListActions.PLACE_BET:
                this._dashboardService.openBetDialog(bet, this._data.stats.credits)
                    .subscribe(this.onPlaceBetFinished.bind(this, bet));
                break;
        }
    }

    get categories(): Array<BetCategory> {
        return this._data.activeBets.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'displayOrder'));
    }

    private onPlaceBetFinished(bet: Bet, credits: number): void {
        if (!credits) {
            return;
        }

        this._httpService.post(`betting/bet/${bet.betId}`, { amount: credits })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'You have now placed your bet!'
                }));
                this._data.stats.credits -= credits;
                this.updateStats();
                this.updateBackers(bet);
                this.buildTrendingTable();
                this.buildSectionTables();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private updateBackers(bet: Bet): void {
        const trending = this._data.trendingBets.find(item => item.betId === bet.betId);
        if (trending) {
            trending.backersCount += 1;
        }

        const activeBets = this._data.activeBets.reduce((prev, curr) => {
            return prev.concat(curr.activeBets);
        }, []);
        const activeBet = activeBets.find(item => item.betId);
        if (activeBet) {
            activeBet.backersCount += 1;
        }
    }

    private onData(data: { data: DashboardModel }): void {
        this._data = data.data || new DashboardModel();

        this.updateStats();
        this.buildTrendingTable();
        this.buildSectionTables();
    }

    private updateStats(): void {
        if (!this._data.stats) {
            return;
        }
        this.stats = getBettingStats(this._data.stats);
    }

    private buildTrendingTable(): void {
        this.trendingTable = new TableConfig({
            title: 'Top 5 Trending Bets',
            headers: this.getTableHeaders(),
            rows: this._data.trendingBets.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'backersCount'))
                .map(bet => {
                    return new TableRow({
                        id: String(bet.betId),
                        cells: [
                            new TableCell({ title: bet.name }),
                            new TableCell({ title: `${bet.leftSide}/${bet.rightSide}` }),
                            new TableCell({ title: String(bet.backersCount) })
                        ],
                        actions: bet.isSuspended ? this._betSuspended : this._placeBet
                    });
                })
        });
    }

    private buildSectionTables(): void {
        this._sectionTables = this._data.activeBets.map(category => {
            return new TableConfig({
                id: category.betCategoryId,
                title: category.name,
                headers: this.getTableHeaders(),
                rows: category.activeBets.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'backersCount')).map(bet => {
                    return new TableRow({
                        id: String(bet.betId),
                        cells: [
                            new TableCell({ title: bet.name }),
                            new TableCell({ title: `${bet.leftSide}/${bet.rightSide}` }),
                            new TableCell({ title: String(bet.backersCount) })
                        ],
                        actions: bet.isSuspended ? this._betSuspended : this._placeBet
                    });
                })
            });
        });
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Bet', width: '70%' }),
            new TableHeader({ title: 'Odds', width: '15%' }),
            new TableHeader({ title: 'Backers', width: '15%' })
        ];
    }

    private updateContractedSections(): void {
        localStorage.setItem(LOCAL_STORAGE.CONTRACTED_SECTIONS, JSON.stringify(this._contractedSections));
    }

    private getContractedSections(): Array<number> {
        const stored = localStorage.getItem(LOCAL_STORAGE.CONTRACTED_SECTIONS);
        return stored ? JSON.parse(stored) : [];
    }
}
