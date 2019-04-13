import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { IgnoredCategory } from './ignored-categories.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-usercp-ignored-threads',
    templateUrl: 'ignored-categories.component.html'
})
export class IgnoredCategoriesComponent extends Page implements OnDestroy {
    private _data: Array<IgnoredCategory> = [];

    tableConfig: TableConfig;

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onAction(action: Action): void {
        this._httpService.delete(`forum/category/${action.rowId}/ignore`)
            .subscribe(() => {
                this._data = this._data.filter(item => item.categoryId !== Number(action.rowId));
                this.buildTableConfig();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Category unignored!'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private onData(data: { data: Array<IgnoredCategory> }): void {
        this._data = data.data;
        this.buildTableConfig();
    }

    private buildTableConfig(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Ignored Categories',
            headers: [
                new TableHeader({ title: 'Category '})
            ],
            rows: this.getTableRows()
        });
    }

    private getTableRows(): Array<TableRow> {
        return this._data.map(item => {
            return new TableRow({
                id: String(item.categoryId),
                cells: [new TableCell({ title: item.title })],
                actions: [new TableAction({ title: 'Unignore', value: null })]
            });
        });
    }
}
