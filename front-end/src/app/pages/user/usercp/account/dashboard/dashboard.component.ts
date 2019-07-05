import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
import { TabModel } from 'shared/app-views/header/tabs/tabs.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { NotificationService } from 'core/services/notification/notification.service';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';

@Component({
    selector: 'app-user-usercp-dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends Page implements OnDestroy {
    private _tabs: Array<TabModel> = [];

    tableConfig: TableConfig;

    isEditorSourceMode: boolean;
    doIgnoreSignatures: boolean;
    haveFixedMenu: boolean;
    showThreadTools: boolean;
    minimalisticHeader: boolean;
    disableMiniProfile: boolean;
    saveTab: Array<TitleTab> = [
        new TitleTab({title: 'Save'})
    ];

    stats: Array<StatsBoxModel> = [
        new StatsBoxModel({
            borderColor: TitleTopBorder.GREEN,
            icon: 'fas fa-coins',
            title: 'Template 1',
            breadText: 'Template 1'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.RED,
            icon: 'fas fa-gem',
            title: 'Template 2',
            breadText: 'Template 2'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.BLUE,
            icon: 'fas fa-thumbs-up',
            title: 'Template 3',
            breadText: 'Template 3'
        }),
        new StatsBoxModel({
            borderColor: TitleTopBorder.PINK,
            icon: 'fas fa-thumbs-down',
            title: 'Template 4',
            breadText: 'Template 4'
        })
    ];

    constructor (
        private _continuesInformation: ContinuesInformationService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Dashboard',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
        try {
            this._tabs = JSON.parse(localStorage.getItem(LOCAL_STORAGE.TABS))
                .map(item => new TabModel(item));
            this.createOrUpdateTable();
        } catch (e) {
            this._tabs = [];
        }

        this.isEditorSourceMode = Boolean(localStorage.getItem(LOCAL_STORAGE.EDITOR_MODE));
        this.doIgnoreSignatures = Boolean(localStorage.getItem(LOCAL_STORAGE.IGNORE_SIGNATURES));
        this.haveFixedMenu = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
        this.showThreadTools = Boolean(localStorage.getItem(LOCAL_STORAGE.FORUM_TOOLS));
        this.minimalisticHeader = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        this.disableMiniProfile = Boolean(localStorage.getItem(LOCAL_STORAGE.MINI_PROFILE_DISABLED));
    }

    onSave (): void {
        this.updateEditorSourceMode();
        this.updateIgnoreSignatures();
        this.updateFixedMenu();
        this.updateThreadTools();
        this.updateMinimalisticHeader();
        this.updateDisabledMiniProfile();
        this._notificationService.sendInfoNotification('Device settings saved!');
        this._continuesInformation.deviceSettingsUpdated();
    }

    onAction (action: Action): void {
        this._tabs = this._tabs.filter(item => item.label.toLowerCase() !== action.rowId.toLowerCase());
        localStorage.setItem(LOCAL_STORAGE.TABS, JSON.stringify(this._tabs));
        this._continuesInformation.tabsUpdated();
        this.createOrUpdateTable();
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private updateDisabledMiniProfile (): void {
        if (this.disableMiniProfile) {
            localStorage.setItem(LOCAL_STORAGE.MINI_PROFILE_DISABLED, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.MINI_PROFILE_DISABLED);
        }
    }

    private updateEditorSourceMode (): void {
        if (this.isEditorSourceMode) {
            localStorage.setItem(LOCAL_STORAGE.EDITOR_MODE, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.EDITOR_MODE);
        }
    }

    private updateIgnoreSignatures (): void {
        if (this.doIgnoreSignatures) {
            localStorage.setItem(LOCAL_STORAGE.IGNORE_SIGNATURES, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.IGNORE_SIGNATURES);
        }
    }

    private updateFixedMenu (): void {
        if (this.haveFixedMenu) {
            localStorage.setItem(LOCAL_STORAGE.FIXED_MENU, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.FIXED_MENU);
        }
    }

    private updateThreadTools (): void {
        if (this.showThreadTools) {
            localStorage.setItem(LOCAL_STORAGE.FORUM_TOOLS, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.FORUM_TOOLS);
        }
    }

    private updateMinimalisticHeader (): void {
        if (this.minimalisticHeader) {
            localStorage.setItem(LOCAL_STORAGE.MINIMALISTIC, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.MINIMALISTIC);
        }
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Device Tabs',
            headers: [new TableHeader({title: 'Label'}), new TableHeader({title: 'URL'})],
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._tabs.map(tab => new TableRow({
            id: tab.label,
            cells: [
                new TableCell({title: tab.label}),
                new TableCell({title: tab.url})
            ],
            actions: [
                new TableAction({title: 'Remove'})
            ]
        }));
    }
}
