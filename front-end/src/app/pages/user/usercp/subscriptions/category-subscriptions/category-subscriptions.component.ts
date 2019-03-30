import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { ActivatedRoute } from '@angular/router';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { CategorySubscription, CategorySubscriptionActions } from './category-subscriptions.model';
import { CategorySubscriptionsService } from '../services/category-subscriptions.service';

@Component({
    selector: 'app-usercp-category-subscriptions',
    templateUrl: 'category-subscriptions.component.html'
})
export class CategorySubscriptionsComponent extends Page implements OnDestroy {
    private _data: Array<CategorySubscription> = [];

    tableConfig: TableConfig;

    constructor(
        private _service: CategorySubscriptionsService,
        private _globalNotificationService: GlobalNotificationService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Category Subscriptions',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onAction(action: Action): void {
        if (action.value !== CategorySubscriptionActions.UNSUBSCRIBE) {
            return;
        }

        this._service.unsubscribe(Number(action.rowId))
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Category unsubscribed'
                }));
                this._data = this._data.filter(item => item.categoryId !== Number(action.rowId));
                this.createOrUpdateTable();
            });
    }

    private onData(data: { data: Array<CategorySubscription> }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable(): void {
        this.tableConfig = new TableConfig({
            title: 'Category Subscriptions',
            headers: CategorySubscriptionsComponent.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows(): Array<TableRow> {
        return this._data.map((subscription, index) => {
            return new TableRow({
                id: String(subscription.categoryId),
                cells: [
                    new TableCell({ title: String(index + 1) }),
                    new TableCell({ title: subscription.title })
                ],
                actions: [new TableAction({
                    title: 'Unsubscribe',
                    value:  CategorySubscriptionActions.UNSUBSCRIBE
                })]
            });
        });
    }

    private static getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Nr' }),
            new TableHeader({ title: 'Category' })
        ];
    }
}
