import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';
import { MyBetsModel } from './my-bets.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BETTING_HUB } from '../betting.constants';
import { getBettingStats } from '../betting.model';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';

@Component({
    selector: 'app-betting-my-bets',
    templateUrl: 'my-bets.component.html'
})
export class MyBetsComponent extends Page implements OnDestroy {
    private _data: MyBetsModel = new MyBetsModel();

    tableConfig: TableConfig;
    stats: Array<StatsBoxModel> = [];

    constructor (
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'My Active Bets',
            items: [
                BETTING_HUB
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private onData (data: { data: MyBetsModel }): void {
        this._data = data.data;
        this.createOrUpdateTable();
        this.stats = getBettingStats(this._data.stats);
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'My Active Bets',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.bets.map(bet => new TableRow({
            cells: [
                new TableCell({ title: bet.name }),
                new TableCell({ title: bet.odds }),
                new TableCell({ title: String(bet.placed) }),
                new TableCell({ title: String(bet.expected) })
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Bet', width: '50%' }),
            new TableHeader({ title: 'Odds', width: '15%' }),
            new TableHeader({ title: 'Amount', width: '15%' }),
            new TableHeader({ title: 'Expected Return', width: '15%' })
        ];
    }
}
