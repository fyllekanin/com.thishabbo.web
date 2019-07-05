import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_SUBSCRIPTIONS_BREADCRUMB_ITEMS, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { SubscriptionListAction, SubscriptionsListPage } from './list.model';
import {
    Action,
    FilterConfig,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { PaginationModel } from 'shared/app-views/pagination/pagination.model';
import { QueryParameters } from 'core/services/http/http.model';
import { SubscriptionsListService } from '../../services/subscriptions-list.service';

@Component({
    selector: 'app-sitecp-shop-subscriptions-list',
    templateUrl: 'subscriptions-list.component.html'
})
export class SubscriptionsListComponent extends Page implements OnDestroy {
    private _data: SubscriptionsListPage;
    private _filter: QueryParameters;
    private _filterTimer: NodeJS.Timer;

    private _actions: Array<TableAction> = [
        new TableAction({title: 'Edit', value: SubscriptionListAction.EDIT}),
        new TableAction({title: 'Delete', value: SubscriptionListAction.DELETE})
    ];

    tableConfig: TableConfig;
    pagination: PaginationModel;
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Create New', link: '/sitecp/shop/subscriptions/new'})
    ];

    constructor (
        private _service: SubscriptionsListService,
        private _router: Router,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: SHOP_SUBSCRIPTIONS_BREADCRUMB_ITEMS.title,
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onAction (action: Action): void {
        switch (action.value) {
            case SubscriptionListAction.EDIT:
                this._router.navigateByUrl(`/sitecp/shop/subscriptions/${action.rowId}`);
                break;
            case SubscriptionListAction.DELETE:
                const subscriptionId = Number(action.rowId);
                this._service.delete(subscriptionId).then(() => {
                    this._data.items = this._data.items.filter(item => item.subscriptionId !== subscriptionId);
                    this.createOrUpdateTable();
                });
                break;
        }
    }

    onFilter (params: QueryParameters): void {
        clearTimeout(this._filterTimer);
        this._filter = params;
        this._filterTimer = setTimeout(() => {
            this._service.getPage(1, this._filter).subscribe(res => {
                this.onData({data: res});
            });
        }, 200);
    }

    private onData (data: { data: SubscriptionsListPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();
        this.pagination = new PaginationModel({
            page: this._data.page,
            total: this._data.total,
            url: '/sitecp/shop/subscriptions/page/:page',
            params: this._filter
        });
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Subscriptions',
            headers: this.getTableHeaders(),
            rows: this.getTableRows(),
            filterConfigs: [
                new FilterConfig({
                    title: 'Filter',
                    placeholder: 'Search by title...',
                    key: 'filter'
                })
            ]
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            id: item.subscriptionId.toString(),
            cells: [
                new TableCell({title: item.title}),
                new TableCell({title: item.membersCount.toString()}),
                new TableCell({title: item.isListed ? 'Yes' : 'No'})
            ],
            actions: this._actions
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Title'}),
            new TableHeader({title: 'Subscribers'}),
            new TableHeader({title: 'Is Listed'})
        ];
    }
}
