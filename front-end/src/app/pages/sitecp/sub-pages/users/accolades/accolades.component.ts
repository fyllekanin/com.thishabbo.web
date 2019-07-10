import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, USER_LIST_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import { AccoladeActions, AccoladeItem, AccoladesPage } from './accolades.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { AccoladesService } from '../services/accolades.service';
import { DialogService } from 'core/services/dialog/dialog.service';

@Component({
    selector: 'app-sitecp-user-accolades',
    templateUrl: 'accolades.component.html'
})
export class AccoladesComponent extends Page implements OnDestroy {
    private _data: AccoladesPage;

    tableConfig: TableConfig;
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Create Accolade', value: AccoladeActions.CREATE}),
        new TitleTab({title: 'Back', value: AccoladeActions.BACK})
    ];

    constructor (
        private _dialogService: DialogService,
        private _service: AccoladesService,
        private _router: Router,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'User Accolades',
            items: [
                SITECP_BREADCRUMB_ITEM,
                USER_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onTabClick (action: number): void {
        switch (action) {
            case AccoladeActions.CREATE:
                this.onCreateAccolade();
                break;
            case AccoladeActions.BACK:
                this._router.navigateByUrl('/sitecp/users/page/1');
                break;
        }
    }

    onCreateAccolade (): void {
        this._service.onCreateAccolade(this._data).then(item => {
            this._data.items.push(item);
            this.createOrUpdateTable();
        });
    }

    onAction (action: Action): void {
        switch (action.value) {
            case AccoladeActions.EDIT:
                this._service.onUpdateAccolade(this._data, Number(action.rowId)).then(item => {
                    const index = this._data.items.findIndex(accolade => accolade.accoladeId === Number(action.rowId));
                    this._data.items[index] = item;
                    this.createOrUpdateTable();
                });
                break;
            case AccoladeActions.DELETE:
                this._dialogService.confirm({
                    title: 'Delete Accolade',
                    content: 'Are you sure you want to delete this Accolade?',
                    callback: () => {
                        this._service.onDeleteAccolade(this._data, Number(action.rowId)).subscribe(accoladeId => {
                            this._data.items = this._data.items.filter(item => item.accoladeId !== accoladeId);
                            this.createOrUpdateTable();
                            this._dialogService.closeDialog();
                        });
                    }
                });
                break;
        }
    }

    get title (): string {
        return `${this._data.user.nickname}'s Accolades`;
    }

    private onData (data: { data: AccoladesPage }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: `${this._data.user.nickname} Accolades`,
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        this._data.items.sort((a, b) => {
            if (a.start > b.start) {
                return 1;
            }
            if (a.start < b.start) {
                return -1;
            }
            return 0;
        });
        return this._data.items.map(item => new TableRow({
            id: item.accoladeId.toString(),
            cells: [
                new TableCell({title: this.getRoleHtml(item), innerHTML: true}),
                new TableCell({title: item.getStartLabel()}),
                new TableCell({title: item.getEndLabel()})
            ],
            actions: [
                new TableAction({title: 'Edit', value: AccoladeActions.EDIT}),
                new TableAction({title: 'Delete', value: AccoladeActions.DELETE})
            ]
        }));
    }

    private getRoleHtml (item: AccoladeItem): string {
        const type = this._data.types.find(t => t.id === item.type);
        return `<span style="color: ${type.color}"><i class="${type.icon}"></i> ${item.role}</span>`;
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Role'}),
            new TableHeader({title: 'Start'}),
            new TableHeader({title: 'End'})
        ];
    }
}
