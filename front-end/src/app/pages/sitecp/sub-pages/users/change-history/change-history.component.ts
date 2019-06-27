import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, USER_LIST_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { ChangeHistoryPage } from './change-history.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';

@Component({
    selector: 'app-sitecp-user-change-history',
    templateUrl: 'change-history.component.html'
})
export class ChangeHistoryComponent extends Page implements OnDestroy {
    private _data: ChangeHistoryPage;

    pagination: PaginationModel;
    tableConfig: TableConfig;

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Change history',
            items: [
                SITECP_BREADCRUMB_ITEM,
                USER_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    private onData (data: { data: ChangeHistoryPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            total: this._data.total,
            page: this._data.page,
            url: `/sitecp/users/${this._data.userId}/history/page/:page`
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Change History',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            id: item.logId.toString(),
            cells: [
                new TableCell({title: item.type}),
                new TableCell({title: item.user.nickname}),
                new TableCell({title: item.oldValue}),
                new TableCell({title: item.newValue}),
                new TableCell({title: item.createdAt})
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Type'}),
            new TableHeader({title: 'User'}),
            new TableHeader({title: 'Old Value'}),
            new TableHeader({title: 'New Value'}),
            new TableHeader({title: 'Time'})
        ];
    }
}
