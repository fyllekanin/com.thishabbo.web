import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, USER_LIST_BREADCRUMB_ITEM } from '../../../admin.constants';
import { UserSubscriptionItem, UserSubscriptionsAction, UserSubscriptionsPage } from './subscriptions.model';
import { SubscriptionsService } from '../services/subscriptions.service';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { DialogService } from 'core/services/dialog/dialog.service';
import { SubscriptionComponent } from './subscription/subscription.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { TitleTab } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-admin-users-subscriptions',
    templateUrl: 'subscriptions.component.html'
})
export class SubscriptionsComponent extends Page implements OnDestroy {
    private _data: UserSubscriptionsPage;
    private _actions: Array<TableAction> = [
        new TableAction({title: 'Update', value: UserSubscriptionsAction.UPDATE}),
        new TableAction({title: 'Delete', value: UserSubscriptionsAction.DELETE})
    ];

    tableConfig: TableConfig;
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Create Subscription'})
    ];

    constructor (
        private _service: SubscriptionsService,
        private _dialogService: DialogService,
        private _componentFactory: ComponentFactoryResolver,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Subscriptions',
            items: [
                SITECP_BREADCRUMB_ITEM,
                USER_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    create (): void {
        this.onCreate();
    }

    onAction (action: Action): void {
        switch (action.value) {
            case UserSubscriptionsAction.UPDATE:
                this.onUpdate(Number(action.rowId));
                break;
            case UserSubscriptionsAction.DELETE:
                this.onDelete(Number(action.rowId));
                break;
        }
    }

    private onData (data: { data: UserSubscriptionsPage }) {
        this._data = data.data;
        this.createOrUpdateConfig();
    }

    private createOrUpdateConfig (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: `${this._data.user.nickname} subscriptions`,
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.userSubscriptions.map(item => new TableRow({
            id: item.userSubscriptionId.toString(),
            cells: [
                new TableCell({title: item.title}),
                new TableCell({title: TimeHelper.getLongDate(item.expiresAt)})
            ],
            actions: this._actions
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Subscription'}),
            new TableHeader({title: 'Expires At'})
        ];
    }

    private onCreate (): void {
        this._dialogService.openDialog({
            title: 'Creating subscription',
            component: this._componentFactory.resolveComponentFactory(SubscriptionComponent),
            data: {subscription: new UserSubscriptionItem(null), subscriptions: this._data.subscriptions},
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Save',
                    callback: data => {
                        this._service.create(this._data.user.userId, {
                            subscriptionId: data.subscriptionId,
                            expiresAt: data.expiresAt
                        }).then(item => {
                            this._data.userSubscriptions.push(item);
                            this.createOrUpdateConfig();
                            this._dialogService.closeDialog();
                        });
                    }
                })
            ]
        });
    }

    private onUpdate (userSubscriptionId: number): void {
        const subscription = this._data.userSubscriptions.find(item => item.userSubscriptionId === userSubscriptionId);
        this._dialogService.openDialog({
            title: 'Editing subscription',
            component: this._componentFactory.resolveComponentFactory(SubscriptionComponent),
            data: {subscription: subscription, subscriptions: this._data.subscriptions},
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Save',
                    callback: data => {
                        this._service.update({userSubscriptionId: userSubscriptionId, expiresAt: data.expiresAt});
                        subscription.expiresAt = data.expiresAt;
                        this.createOrUpdateConfig();
                        this._dialogService.closeDialog();
                    }
                })
            ]
        });
    }

    private onDelete (userSubscriptionId: number): void {
        this._service.delete(userSubscriptionId).then(() => {
            this._data.userSubscriptions = this._data.userSubscriptions.filter(item => item.userSubscriptionId !== userSubscriptionId);
            this.createOrUpdateConfig();
        });
    }
}
