import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BookingActions, BookingItem, BookingLogModel } from './booking-log.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import {
    STAFFCP_BREADCRUM_ITEM,
    STAFFCP_EVENTS_BREADCRUM_ITEM,
    STAFFCP_RADIO_BREADCRUM_ITEM
} from '../../../staff.constants';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-staff-booking',
    templateUrl: 'booking-log.component.html'
})
export class BookingLogComponent extends Page implements OnDestroy {
    private readonly _type;
    private _data: BookingLogModel = new BookingLogModel();

    pagination: PaginationModel;
    tableConfig: TableConfig;

    constructor (
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this._type = activatedRoute.snapshot.data['type'];
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Booking Log',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                (this._type === 'events' ? STAFFCP_EVENTS_BREADCRUM_ITEM : STAFFCP_RADIO_BREADCRUM_ITEM)
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private onData (data: { data: BookingLogModel }): void {
        this._data = data.data;

        this.createOrUpdateTable();
        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: `/staff/${this._type}/booking/page/:page`
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Booking Log',
            headers: BookingLogComponent.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        const hours = TimeHelper.getHours();
        return this._data.items.map(BookingLogComponent.mapItemToRow.bind(this, hours));
    }

    private static mapItemToRow (hours, item: BookingItem): TableRow {
        const hour = TimeHelper.getConvertedHour(item.hour + TimeHelper.getTimeOffsetInHours());
        const day = TimeHelper.getConvertedDay(item.hour + TimeHelper.getTimeOffsetInHours(), item.day);
        return new TableRow({
            cells: [
                new TableCell({title: item.user.nickname}),
                new TableCell({title: item.affected.nickname}),
                new TableCell({title: BookingLogComponent.getActionText(item)}),
                new TableCell({title: `${TimeHelper.getDay(day).label} at ${hours[hour].label}`}),
                new TableCell({title: TimeHelper.getTime(item.updatedAt)})
            ]
        });
    }

    private static getActionText (item: BookingItem): string {
        switch (item.action) {
            case BookingActions.UNBOOKED_EVENT:
            case BookingActions.UNBOOKED_RADIO:
                return 'Unbooked';
            case BookingActions.BOOKED_EVENTS:
            case BookingActions.BOOKED_RADIO:
                return 'Booked';
            case BookingActions.CREATED_PERM:
                return 'Created perm show';
            case BookingActions.DELETED_PERM:
                return 'Deleted perm show';
            case BookingActions.EDITED_EVENTS:
            case BookingActions.EDITED_RADIO:
                return 'Edited';
            default:
                return 'Unknown';
        }
    }

    private static getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'User'}),
            new TableHeader({title: 'Affected'}),
            new TableHeader({title: 'Action'}),
            new TableHeader({title: 'Slot'}),
            new TableHeader({title: 'Timestamp'})
        ];
    }
}
