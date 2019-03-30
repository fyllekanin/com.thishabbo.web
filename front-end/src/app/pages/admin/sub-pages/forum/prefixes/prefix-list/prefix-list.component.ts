import { Prefix, PrefixActions } from '../prefix.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';


@Component({
    selector: 'app-admin-forum-prefix-list',
    templateUrl: 'prefix-list.component.html'
})
export class PrefixListComponent extends Page implements OnDestroy {
    private _prefixes: Array<Prefix> = [];

    tableConfig: TableConfig;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'New Prefix', link: '/admin/forum/prefixes/new' })
    ];

    constructor(
        private _router: Router,
        private _globalNotificationService: GlobalNotificationService,
        private _dialogService: DialogService,
        private _httpService: HttpService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onAction(action: Action): void {
        const prefix = this._prefixes.find(item => item.prefixId === Number(action.rowId));
        switch (action.value) {
            case PrefixActions.EDIT_PREFIX:
                this._router.navigateByUrl(`/admin/forum/prefixes/${action.rowId}`);
                break;
            case PrefixActions.DELETE_PREFIX:
                this._dialogService.openConfirmDialog(
                    `Delete Prefix`,
                    `Are you sure that you want to delete the prefix?`,
                    this.onDelete.bind(this, prefix)
                );
                break;
        }
    }

    private onDelete(prefix: Prefix): void {
        this._httpService.delete(`admin/prefixes/${prefix.prefixId}`)
            .subscribe(() => {
                this._prefixes = this._prefixes.filter(pre => pre.prefixId !== prefix.prefixId);
                this.createOrUpdateTable();
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Prefix deleted!'
                }));
                this._dialogService.closeDialog();
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private onData(data: { data: Array<Prefix> }): void {
        this._prefixes = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Prefixes',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows(): Array<TableRow> {
        const actions = [
            new TableAction({ title: 'Edit Prefix', value: PrefixActions.EDIT_PREFIX }),
            new TableAction({ title: 'Delete Prefix', value: PrefixActions.DELETE_PREFIX })
        ];
        return this._prefixes.map(prefix => {
            return new TableRow({
                id: String(prefix.prefixId),
                cells: [
                    new TableCell({ title: `<span style="${prefix.style}">${prefix.text}</span>`, innerHTML: true })
                ],
                actions: actions
            });
        });
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Text' })
        ];
    }
}

