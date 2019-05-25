import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import {
    Action,
    FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { Page } from 'shared/page/page.model';
import { STAFFCP_BREADCRUM_ITEM, STAFFCP_EVENTS_BREADCRUM_ITEM } from '../../../staff.constants';
import { TypeComponent } from './type/type.component';
import { EventType, EventTypesListActions, EventTypesPage } from './types.model';
import { QueryParameters } from 'core/services/http/http.model';

@Component({
    selector: 'app-staff-events-types',
    templateUrl: 'types.component.html'
})
export class TypesComponent extends Page implements OnDestroy {
    private _data: EventTypesPage;
    private _filterTimer;
    private _filter: QueryParameters;

    tableConfig: TableConfig;
    pagination: PaginationModel;
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Create New'})
    ];

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        private _componentFactory: ComponentFactoryResolver,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Types',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                STAFFCP_EVENTS_BREADCRUM_ITEM
            ]
        });
    }

    onFilter (filter: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = filter;

        this._filterTimer = setTimeout(() => {
            this._httpService.get(`staff/events/types/page/1`, filter)
                .subscribe(res => {
                    this.onData({data: new EventTypesPage(res)});
                });
        }, 200);
    }

    onTabClick (): void {
        this._dialogService.openDialog({
            title: 'Creating Event',
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({title: 'Create', callback: this.createEvent.bind(this)})
            ],
            component: this._componentFactory.resolveComponentFactory(TypeComponent),
            data: new EventType()
        });
    }

    onAction (action: Action): void {
        switch (action.value) {
            case EventTypesListActions.EDIT_TYPE:
                this.onEdit(Number(action.rowId));
                break;
            case EventTypesListActions.DELETE_TYPE:
                this.onDelete(Number(action.rowId));
                break;
        }
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private onEdit (eventId: number): void {
        this._dialogService.openDialog({
            title: 'Creating Event',
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Save',
                    callback: this.saveEvent.bind(this)
                })
            ],
            component: this._componentFactory.resolveComponentFactory(TypeComponent),
            data: this._data.events.find(event => event.eventId === eventId)
        });
    }

    private onDelete (eventId: number): void {
        this._dialogService.confirm({
            title: `Deleting Event`,
            content: `Are you sure you wanna delete this event?`,
            callback: () => {
                this._httpService.delete(`staff/events/types/${eventId}`)
                    .subscribe(() => {
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Event deleted!'
                        }));
                        this._dialogService.closeDialog();
                        this._data.events = this._data.events.filter(event => event.eventId !== eventId);
                        this.createOrUpdateTable();
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }

    private saveEvent (event: EventType): void {
        this._httpService.put(`staff/events/types/${event.eventId}`, {event: event})
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Event saved!'
                }));
                this._data.events = this._data.events.filter(evt => evt.eventId !== event.eventId);
                this._data.events.push(event);
                this._dialogService.closeDialog();
                this.createOrUpdateTable();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private createEvent (event: EventType): void {
        this._httpService.post('staff/events/types', {event: event})
            .subscribe(res => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Event created!'
                }));
                this._data.events.push(new EventType(res));
                this._dialogService.closeDialog();
                this.createOrUpdateTable();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData (data: { data: EventTypesPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();

        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: `/staff/events/types/page/:page`,
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Event Types',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [new FilterConfig({
                title: 'Filter',
                placeholder: 'Search for Event Types...',
                key: 'filter'
            })]
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.events.map(event => new TableRow({
            id: String(event.eventId),
            cells: [
                new TableCell({title: event.name, value: 'Name'}),
                new TableCell({title: TimeHelper.getTime(event.createdAt), value: 'Created At'})
            ],
            actions: [
                new TableAction({title: 'Edit', value: EventTypesListActions.EDIT_TYPE}),
                new TableAction({title: 'Delete', value: EventTypesListActions.DELETE_TYPE})
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Name'}),
            new TableHeader({title: 'Created At'})
        ];
    }
}
