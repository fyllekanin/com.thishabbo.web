import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { STAFFCP_BREADCRUM_ITEM } from '../../../staff.constants';
import { CurrentListener } from './current-listeners.model';

@Component({
    selector: 'app-staff-management-current-listeners',
    templateUrl: 'current-listeners.component.html',
    styleUrls: ['current-listeners.component.css']
})
export class CurrentListenersComponent extends Page implements OnDestroy {
    private _data: Array<CurrentListener> = [];

    tableConfig: TableConfig;

    constructor(
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Current Listeners',
            items: [
                STAFFCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    private onData(data: { data: Array<CurrentListener> }): void {
        this._data = data.data;
        this.tableConfig = new TableConfig({
            title: `Current Listeners (${this._data.length})`,
            headers: this.getTableHeaders(),
            rows: this._data.map(item => new TableRow({
                cells: [
                    new TableCell({ title: item.user ? item.user.nickname : 'Unknown' }),
                    new TableCell({ title: `${item.time} seconds` })
                ]
            }))
        });
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'User' }),
            new TableHeader({ title: 'Listening Time' })
        ];
    }
}
