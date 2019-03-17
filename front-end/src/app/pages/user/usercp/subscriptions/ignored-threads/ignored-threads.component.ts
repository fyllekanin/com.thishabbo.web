import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { IgnoredThread } from './ignored-threads.model';
import { ActivatedRoute } from '@angular/router';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-usercp-ignored-threads',
    templateUrl: 'ignored-threads.component.html'
})
export class IgnoredThreadsComponent extends Page implements OnDestroy {
    private _data: Array<IgnoredThread> = [];

    tableConfig: TableConfig;

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService,
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
        this._httpService.delete(`forum/thread/${action.rowId}/ignore`)
            .subscribe(() => {
                this._data = this._data.filter(item => item.threadId !== Number(action.rowId));
                this.buildTableConfig();
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Thread unignored'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onData(data: { data: Array<IgnoredThread> }): void {
        this._data = data.data;
        this.buildTableConfig();
    }

    private buildTableConfig(): void {
        this.tableConfig = new TableConfig({
            title: 'Ignored Threads',
            headers: [
                new TableHeader({ title: 'Thread '})
            ],
            rows: this._data.map(item => {
                return new TableRow({
                    id: String(item.threadId),
                    cells: [new TableCell({ title: item.title })],
                    actions: [new TableAction({ title: 'Unignore', value: null })]
                });
            })
        });
    }
}
