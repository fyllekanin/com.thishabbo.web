import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { ThreadSubscription, ThreadSubscriptionActions } from './thread-subscriptions.model';
import { ActivatedRoute } from '@angular/router';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { ThreadSubscriptionsService } from '../services/thread-subscriptions.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-usercp-thread-subscriptions',
    templateUrl: 'thread-subscriptions.component.html'
})
export class ThreadSubscriptionsComponent extends Page implements OnDestroy {
    private _data: Array<ThreadSubscription> = [];

    tableConfig: TableConfig;

    constructor (
        private _service: ThreadSubscriptionsService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Thread Subscriptions',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: Action): void {
        this._service.unsubscribe(Number(action.rowId))
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Thread unsubscribed'
                }));
                this._data = this._data.filter(item => item.threadId !== Number(action.rowId));
                this.createOrUpdateTable();
            });
    }

    private onData (data: { data: Array<ThreadSubscription> }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Thread Subscriptions',
            headers: ThreadSubscriptionsComponent.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.map((subscription, index) => {
            return new TableRow({
                id: String(subscription.threadId),
                cells: [
                    new TableCell({ title: String(index + 1) }),
                    new TableCell({ title: subscription.title })
                ],
                actions: [ new TableAction({
                    title: 'Unsubscribe',
                    value: ThreadSubscriptionActions.UNSUBSCRIBE
                }) ]
            });
        });
    }

    private static getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Number' }),
            new TableHeader({ title: 'Thread' })
        ];
    }
}
