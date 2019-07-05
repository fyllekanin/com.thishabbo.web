import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { ActivatedRoute } from '@angular/router';
import { GroupList, GroupsActions } from './groups-list.model';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../../../sitecp.constants';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { SelectItem } from 'shared/components/form/select/select.model';
import { StringHelper } from 'shared/helpers/string.helper';


@Component({
    selector: 'app-sitecp-content-groups-list',
    templateUrl: 'groups-list.component.html'
})
export class GroupsListComponent extends Page implements OnDestroy {
    private _groupsList: Array<GroupList> = [];
    private _possibleColors: Array<{ label: string, color: string }> = [];

    selectedGroup: SelectItem;
    selectedColor: string;
    selectableGroups: Array<SelectItem> = [];
    tableConfig: TableConfig;
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Save', value: GroupsActions.SAVE}),
        new TitleTab({title: 'Add Group', value: GroupsActions.ADD})
    ];

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        this._possibleColors = Object.keys(TitleTopBorder).map(key => ({
            label: StringHelper.prettifyString(key),
            color: key
        }));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Manage Staff List',
            items: [SITECP_BREADCRUMB_ITEM]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onTabClick(value: number): void {
        switch (value) {
            case GroupsActions.SAVE:
                this.onSave();
                break;
            case GroupsActions.ADD:
                this.addGroup();
                break;
        }
    }

    onSave(): void {
        const groups = this.tableConfig.rows.map(row => {
            const group = this._groupsList.find(item => item.groupId === Number(row.id));
            group.displayOrder = Number(row.cells.find(cell => cell.isEditable).value);
            return group;
        });
        this._httpService.put('sitecp/content/groupslist', {groups: groups})
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'The staff list has been saved!'
                }));
                this.createOrUpdateTable();
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    addGroup(): void {
        const group = this._groupsList
            .filter(grp => grp.displayOrder === -1)
            .find(grp => grp.groupId === Number(this.selectedGroup && this.selectedGroup.value));

        if (!group) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'An error has occured!',
                message: 'The group does not exist or it has already been added!',
                type: NotificationType.ERROR
            }));
            return;
        }

        if (!this.selectedColor) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'An error has occured!',
                message: 'You need to select a colour!',
                type: NotificationType.ERROR
            }));
            return;
        }

        const highestOrder = this._groupsList.reduce((prev, curr) => {
            return (prev ? prev.displayOrder : 0) > curr.displayOrder ? prev : curr;
        }, null);
        group.displayOrder = highestOrder ? highestOrder.displayOrder + 1 : 0;
        group.color = this.selectedColor;
        this.selectedGroup = null;
        this.selectedColor = undefined;
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

    get possibleColors(): Array<{ label: string, color: string }> {
        return this._possibleColors;
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
            return {label: item.name, value: item.groupId};
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
                new TableCell({title: item.name}),
                new TableCell({title: 'Display Order', isEditable: true, value: item.displayOrder.toString()}),
                new TableCell({title: StringHelper.prettifyString(item.color)})
            ],
            actions: [
                new TableAction({title: 'Remove'})
            ]
        }));
    }

    private getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({title: 'Group'}),
            new TableHeader({title: 'Display Order'}),
            new TableHeader({title: 'Color'})
        ];
    }
}
