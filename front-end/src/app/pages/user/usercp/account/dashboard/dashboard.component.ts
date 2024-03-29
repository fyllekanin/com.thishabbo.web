import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { StatsBoxModel } from 'shared/app-views/stats-boxes/stats-boxes.model';
import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
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
import { TabsActionModel, UserCpDashboardModel } from './dashboard.model';
import { ActivatedRoute } from '@angular/router';
import { TimeHelper } from 'shared/helpers/time.helper';
import { AuthService } from 'core/services/auth/auth.service';
import { HttpService } from 'core/services/http/http.service';
import { ArrayHelper } from 'shared/helpers/array.helper';

@Component({
    selector: 'app-user-usercp-dashboard',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends Page implements OnDestroy {
    private _data: UserCpDashboardModel = new UserCpDashboardModel();
    tabsTableConfig: TableConfig;
    subscriptionsTableConfig: TableConfig;

    stats: Array<StatsBoxModel> = [];
    isEditorSourceMode: boolean;
    doIgnoreSignatures: boolean;
    haveFixedMenu: boolean;
    showThreadTools: boolean;
    minimalisticHeader: boolean;
    disableMiniProfile: boolean;
    hideForumStats: boolean;
    singleLatestRow: boolean;
    showMentionSuggestions: boolean;
    saveTab: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor (
        private _continuesInformation: ContinuesInformationService,
        private _notificationService: NotificationService,
        private _authService: AuthService,
        private _httpService: HttpService,
        activatedRoute: ActivatedRoute,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Dashboard',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
        this.createOrUpdateTabsTable();
        this.createOrUpdateSubscriptionsTable();

        this.isEditorSourceMode = Boolean(localStorage.getItem(LOCAL_STORAGE.EDITOR_MODE));
        this.doIgnoreSignatures = Boolean(localStorage.getItem(LOCAL_STORAGE.IGNORE_SIGNATURES));
        this.haveFixedMenu = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
        this.showThreadTools = Boolean(localStorage.getItem(LOCAL_STORAGE.FORUM_TOOLS));
        this.minimalisticHeader = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        this.disableMiniProfile = Boolean(localStorage.getItem(LOCAL_STORAGE.MINI_PROFILE_DISABLED));
        this.hideForumStats = Boolean(localStorage.getItem(LOCAL_STORAGE.HIDE_FORUM_STATS));
        this.singleLatestRow = Boolean(localStorage.getItem(LOCAL_STORAGE.SINGLE_LATEST_ROW));
        this.showMentionSuggestions = Boolean(localStorage.getItem(LOCAL_STORAGE.MENTION_SUGGESTIONS));
    }

    onSave (): void {
        this.updateEditorSourceMode();
        this.updateIgnoreSignatures();
        this.updateFixedMenu();
        this.updateThreadTools();
        this.updateMinimalisticHeader();
        this.updateDisabledMiniProfile();
        this.updateHideForumStats();
        this.updateSingleLatestRow();
        this.updateMentionSuggestions();
        this._notificationService.sendInfoNotification('Device settings saved!');
        this._continuesInformation.deviceSettingsUpdated();
    }

    onAction (action: Action): void {
        switch (action.value) {
            case TabsActionModel.REMOVE:
                this._httpService.delete(`usercp/tab/${action.rowId}`).subscribe(() => {
                    this._authService.tabs = this._authService.tabs
                        .filter(item => item.tabId !== action.rowId);
                    this._notificationService.sendInfoNotification('Tab deleted!');
                    this.createOrUpdateTabsTable();
                }, this._notificationService.failureNotification.bind(this._notificationService));
                break;
            case TabsActionModel.MOVE_DOWN:
                const downIndex = this._authService.tabs.findIndex(tab => tab.tabId === action.rowId);
                this._authService.tabs = ArrayHelper.move(this._authService.tabs, downIndex, downIndex + 1);
                this._httpService.put('usercp/tabs', { tabs: this._authService.tabs })
                    .subscribe(() => {
                        this.createOrUpdateTabsTable();
                        this._notificationService.sendInfoNotification('Tab order updated');
                    }, this._notificationService.failureNotification.bind(this._notificationService));
                break;
            case TabsActionModel.MOVE_UP:
                const upIndex = this._authService.tabs.findIndex(tab => tab.tabId === action.rowId);
                this._authService.tabs = ArrayHelper.move(this._authService.tabs, upIndex, upIndex - 1);
                this._httpService.put('usercp/tabs', { tabs: this._authService.tabs })
                    .subscribe(() => {
                        this.createOrUpdateTabsTable();
                        this._notificationService.sendInfoNotification('Tab order updated');
                    }, this._notificationService.failureNotification.bind(this._notificationService));
                break;
        }
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    private updateSingleLatestRow (): void {
        if (this.singleLatestRow) {
            localStorage.setItem(LOCAL_STORAGE.SINGLE_LATEST_ROW, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.SINGLE_LATEST_ROW);
        }
    }

    private updateMentionSuggestions (): void {
        if (this.showMentionSuggestions) {
            localStorage.setItem(LOCAL_STORAGE.MENTION_SUGGESTIONS, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.MENTION_SUGGESTIONS);
        }
    }

    private updateDisabledMiniProfile (): void {
        if (this.disableMiniProfile) {
            localStorage.setItem(LOCAL_STORAGE.MINI_PROFILE_DISABLED, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.MINI_PROFILE_DISABLED);
        }
    }

    private updateHideForumStats (): void {
        if (this.hideForumStats) {
            localStorage.setItem(LOCAL_STORAGE.HIDE_FORUM_STATS, 'true');
        } else {
            localStorage.removeItem(LOCAL_STORAGE.HIDE_FORUM_STATS);
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

    private createOrUpdateSubscriptionsTable (): void {
        if (this.subscriptionsTableConfig) {
            this.subscriptionsTableConfig.rows = this.getTabsSubscriptionsRows();
            return;
        }
        this.subscriptionsTableConfig = new TableConfig({
            title: 'Active Subscriptions',
            headers: [ new TableHeader({ title: 'Title' }), new TableHeader({ title: 'Expires At' }) ],
            rows: this.getTabsSubscriptionsRows()
        });
    }

    private createOrUpdateTabsTable (): void {
        if (this.tabsTableConfig) {
            this.tabsTableConfig.rows = this.getTabsTableRows();
            return;
        }
        this.tabsTableConfig = new TableConfig({
            title: 'Tabs',
            headers: [ new TableHeader({ title: 'Label' }), new TableHeader({ title: 'URL' }) ],
            rows: this.getTabsTableRows()
        });
    }

    private getTabsSubscriptionsRows (): Array<TableRow> {
        return this._data.subscriptions.map(subscription => {
            return new TableRow({
                id: subscription.title,
                cells: [
                    new TableCell({ title: subscription.title }),
                    new TableCell({ title: TimeHelper.getLongDate(subscription.expiresAt) })
                ]
            });
        });
    }

    private getTabsTableRows (): Array<TableRow> {
        return this._authService.tabs.map((tab, index) => {
            const actions = [
                { title: 'Move Up', value: TabsActionModel.MOVE_UP, condition: index > 0 },
                {
                    title: 'Mode Down',
                    value: TabsActionModel.MOVE_DOWN,
                    condition: index < (this._authService.tabs.length - 1)
                },
                { title: 'Remove', value: TabsActionModel.REMOVE, condition: true }
            ];
            return new TableRow({
                id: tab.tabId,
                cells: [
                    new TableCell({ title: tab.label }),
                    new TableCell({ title: tab.url })
                ],
                actions: actions.filter(action => action.condition).map(action => new TableAction(action))
            });
        });
    }

    private onData (data: { data: UserCpDashboardModel }) {
        this._data = data.data;
        this.stats = [
            new StatsBoxModel({
                borderColor: TitleTopBorder.GREEN,
                icon: 'fas fa-fill',
                title: 'XP',
                breadText: String(this._data.xp)
            }),
            new StatsBoxModel({
                borderColor: TitleTopBorder.PINK,
                icon: 'fas fa-calendar-alt',
                title: 'Join Date',
                breadText: TimeHelper.getLongDate(this._data.registerTimestamp)
            }),
            new StatsBoxModel({
                borderColor: TitleTopBorder.RED,
                icon: 'fas fa-thumbs-up',
                title: 'Likes',
                breadText: String(this._data.likes)
            }),
            new StatsBoxModel({
                borderColor: TitleTopBorder.BLUE,
                icon: 'fas fa-shopping-cart',
                title: 'Shop Items',
                breadText: String(this._data.itemsOwned)
            })
        ];
    }
}
