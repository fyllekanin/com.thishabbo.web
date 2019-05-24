import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { SlimSubscription, UserSubscriptionItem } from '../subscriptions.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-admin-users-subscriptions-subscription',
    templateUrl: 'subscription.component.html'
})
export class SubscriptionComponent extends InnerDialogComponent {
    private _data: UserSubscriptionItem;
    private _subscriptions: Array<SlimSubscription> = [];
    private _months: Array<{ label: string, value: number }> = [];

    year: number;
    month: number;
    day: number;

    getData (): UserSubscriptionItem {
        const date = new Date(`${this.year}-${this.month}-${this.day || 28}`);
        this._data.expiresAt = isNaN(date.getTime()) ? 0 : date.getTime() / 1000;
        return this._data;
    }

    setData (data: { subscription: UserSubscriptionItem, subscriptions: Array<SlimSubscription> }) {
        this._data = data.subscription;
        this._subscriptions = data.subscriptions;
        this.setDates();
    }

    get model (): UserSubscriptionItem {
        return this._data;
    }

    get subscriptions (): Array<SlimSubscription> {
        return this._subscriptions;
    }

    get months (): Array<{ label: string, value: number }> {
        return this._months;
    }

    private setDates (): void {
        const date = this._data.createdAt ? new Date(this._data.expiresAt * 1000) : new Date();
        this._months = TimeHelper.FULL_MONTHS.map((month, index) => ({label: month, value: index + 1}));
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.day = date.getDate();
    }
}
