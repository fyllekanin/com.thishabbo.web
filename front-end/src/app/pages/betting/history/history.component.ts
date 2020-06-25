import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BETTING_HUB } from '../betting.constants';
import { TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';
import { getBettingStats } from '../betting.model';
import { HistoryModel } from './history.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';

@Component({
    selector: 'app-betting-history',
    templateUrl: 'history.component.html'
})
export class HistoryComponent extends Page implements OnDestroy {
    private _data: HistoryModel = new HistoryModel();

    tableConfig: TableConfig;
    paginationModel: PaginationModel;
    stats: Array<StatsBoxModel> = [];

    constructor (
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'My History',
            items: [
                BETTING_HUB
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private onData (data: { data: HistoryModel }): void {
        this._data = data.data;
        this.createOrUpdateTable();
        this.stats = getBettingStats(this._data.stats);

        this.paginationModel = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: `/betting/history/page/:page`
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'My History',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.history.map(bet => new TableRow({
            cells: [
                new TableCell({ title: bet.name }),
                new TableCell({ title: bet.result ? 'Won' : 'Lost' }),
                new TableCell({
                    title: bet.result ?
                        `Won ${bet.won} credits` : `Lost ${bet.placed} credits`
                })
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Bet', width: '50%' }),
            new TableHeader({ title: 'Result', width: '15%' }),
            new TableHeader({ title: 'Credits', width: '15%' })
        ];
    }
}
