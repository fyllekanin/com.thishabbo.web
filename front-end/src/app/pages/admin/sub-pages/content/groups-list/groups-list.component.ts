import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { ActivatedRoute } from '@angular/router';
import { GroupList } from './groups-list.model';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../admin.constants';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { SelectItem } from 'shared/components/form/select/select.model';


@Component({
    selector: 'app-admin-content-groups-list',
    templateUrl: 'groups-list.component.html',
    styleUrls: ['groups-list.component.css']
})
export class GroupsListComponent extends Page implements OnDestroy {
    private _groupsList: Array<GroupList> = [];

    selectedGroup: SelectItem;
    selectableGroups: Array<SelectItem> = [];
    tableConfig: TableConfig;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Manage Staff List',
            items: [SITECP_BREADCRUMB_ITEM]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onSave(): void {
        const groups = this.tableConfig.rows.map(row => {
            const group = this._groupsList.find(item => item.groupId === Number(row.id));
            group.displayOrder = Number(row.cells.find(cell => cell.isEditable).value);
            return group;
        });
        this._httpService.put('admin/content/groupslist', { groups: groups })
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'List saved'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    addGroup(): void {
        const group = this._groupsList
            .filter(grp => grp.displayOrder === -1)
            .find(grp => grp.groupId === Number(this.selectedGroup.value));
        if (!group) {
            return;
        }

        if (!group) {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Failure',
                message: 'The group do not exist or is already added'
            }));
            return;
        }
        const highestOrder = this._groupsList.reduce((prev, curr) => {
            return (prev ? prev.displayOrder : 0) > curr.displayOrder ? prev : curr;
        }, null);
        group.displayOrder = highestOrder ? highestOrder.displayOrder + 1 : 0;
        this.selectedGroup = null;
        this.updateSelectableGroups();
        this.createOrUpdateTable();
    }

    onRemove(action: Action): void {
        const grp = this._groupsList.find(g => g.groupId === Number(action.rowId));
        if (grp) {
            grp.displayOrder = -1;
        }
        this.updateSelectableGroups();
        this.createOrUpdateTable();
    }

    get addedGroups(): Array<GroupList> {
        return this._groupsList
            .filter(group => group.displayOrder >= 0)
            .sort((a, b) => {
                if (a.displayOrder > b.displayOrder) {
                    return 1;
                } else if (a.displayOrder < b.displayOrder) {
                    return -1;
                }
                return 0;
            });
    }

    private onData(data: { data: Array<GroupList> }): void {
        this._groupsList = data.data;
        this.updateSelectableGroups();
        this.createOrUpdateTable();
    }

    private updateSelectableGroups(): void {
        this.selectableGroups = this._groupsList.filter(item => item.displayOrder === -1).map(item => {
            return { label: item.name, value: item.groupId };
        });
    }

    private createOrUpdateTable(): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Listed Groups',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows(): Array<TableRow> {
        return this.addedGroups.map(item => new TableRow({
            id: String(item.groupId),
            cells: [
                new TableCell({ title: item.name }),
                new TableCell({ title: 'Display Order', isEditable: true, value: item.displayOrder.toString() })
            ],
            actions: [
                new TableAction({ title: 'Remove' })
            ]
        }));
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Group' }),
            new TableHeader({ title: 'Display Order' })
        ];
    }
}
