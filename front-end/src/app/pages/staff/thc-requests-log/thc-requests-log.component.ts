import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { ThcRequestLogPage } from './thc-requests-log.model';
import { TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { STAFFCP_BREADCRUM_ITEM } from '../staff.constants';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';

@Component({
    selector: 'app-staff-thc-requests-log',
    templateUrl: 'thc-requests-log.component.html',
    styleUrls: [ 'thc-requests-log.component.css' ]
})
export class ThcRequestsLogComponent extends Page implements OnDestroy {
    private _data: ThcRequestLogPage;

    tableConfig: TableConfig;
    pagination: PaginationModel;

    constructor (
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'THC Request Log',
            items: [
                STAFFCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private onData (data: { data: ThcRequestLogPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: '/staff/thc-requests-log/page/:page'
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'THC Request Log',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            id: null,
            cells: [
                new TableCell({ title: `${item.nickname} / ${item.habbo}` }),
                new TableCell({ title: `${item.amount}` }),
                new TableCell({ title: item.isPending ? 'Yes' : 'No' }),
                new TableCell({ title: item.isApproved ? 'Yes' : 'No' }),
                new TableCell({ title: item.updatedAt })
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Nickname / Habbo' }),
            new TableHeader({ title: 'Amount' }),
            new TableHeader({ title: 'Is Pending' }),
            new TableHeader({ title: 'Is Approved' }),
            new TableHeader({ title: 'Updated At' })
        ];
    }
}
