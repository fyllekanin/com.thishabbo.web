import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { STAFFCP_BREADCRUM_ITEM } from '../../../staff.constants';
import { EventStatsItem } from './event-stats.model';
import { ActivatedRoute } from '@angular/router';
import {
    FilterConfig,
    FilterConfigItem,
    FilterConfigType,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';

@Component({
    selector: 'app-staff-events-stats',
    templateUrl: 'event-stats.component.html'
})
export class EventStatsComponent extends Page implements OnDestroy {
    private _data: Array<EventStatsItem> = [];

    tableConfig: TableConfig;

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Events Stats',
            items: [
                STAFFCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    private onData (data: { data: Array<EventStatsItem> }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Events Stats',
            headers: this.getTableHeaders(),
            filterConfigs: this.getRegionFilter(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.map(item => new TableRow({
            cells: [
                new TableCell({ title: item.name }),
                new TableCell({ title: String(item.amount) })
            ]
        }));
    }

    private getRegionFilter (): Array<FilterConfig> {
        return [
            new FilterConfig({
                title: 'Region',
                key: 'region',
                allOption: true,
                type: FilterConfigType.SELECT,
                items: [
                    new FilterConfigItem({
                        label: 'All',
                        value: ''
                    }),
                    new FilterConfigItem({
                        label: 'EU',
                        value: 'EU'
                    }),
                    new FilterConfigItem({
                        label: 'NA',
                        value: 'NA'
                    }),
                    new FilterConfigItem({
                        label: 'OC',
                        value: 'OC'
                    })
                ]
            })
        ];
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Event' }),
            new TableHeader({ title: 'Amount' })
        ];
    }
}
