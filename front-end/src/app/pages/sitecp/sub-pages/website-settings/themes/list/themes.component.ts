import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { Theme, ThemeActions } from '../theme.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import {
    SITECP_BREADCRUMB_ITEM,
    THEMES_BREADCRUMB_ITEM,
    WEBSITE_SETTINGS_BREADCRUMB_ITEM
} from '../../../../sitecp.constants';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-sitecp-website-settings-themes-list',
    templateUrl: 'themes.component.html'
})
export class ThemesComponent extends Page implements OnDestroy {
    private _data: Array<Theme> = [];
    private _actions: Array<TableAction> = [
        new TableAction({ title: 'Edit', value: ThemeActions.EDIT }),
        new TableAction({ title: 'Make Default', value: ThemeActions.DEFAULT }),
        new TableAction({ title: 'Delete', value: ThemeActions.DELETE })
    ];

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Create New', link: '/sitecp/website-settings/themes/new' }),
        new TitleTab({ title: 'Clear Default', value: ThemeActions.CLEAR_DEFAULT }),
        new TitleTab({ title: 'Back', link: '/sitecp/website-settings' })
    ];
    tableConfig: TableConfig;

    constructor (
        private _router: Router,
        private _httpService: HttpService,
        private _dialogService: DialogService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: THEMES_BREADCRUMB_ITEM.title,
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onTabClick (value: number): void {
        if (value !== ThemeActions.CLEAR_DEFAULT) {
            return;
        }
        this._httpService.put('sitecp/content/themes/default/clear')
            .subscribe(() => {
                this._data.forEach(item => {
                    item.isDefault = false;
                });
                this.createOrUpdateTable();
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Cleared default theme!'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    onAction (action: Action): void {
        switch (action.value) {
            case ThemeActions.EDIT:
                this._router.navigateByUrl(`/sitecp/website-settings/themes/${action.rowId}`);
                break;
            case ThemeActions.DEFAULT:
                this.onMakeDefault(Number(action.rowId));
                break;
            case ThemeActions.DELETE:
                this.onDelete(Number(action.rowId));
                break;
        }
    }

    private onMakeDefault (themeId: number): void {
        this._dialogService.confirm({
            title: 'Theme Manager',
            content: 'Are you sure you want to make this theme default?',
            callback: () => {
                this._httpService.put(`sitecp/content/themes/default/${themeId}`)
                    .subscribe(() => {
                        this._data.forEach(item => {
                            item.isDefault = item.themeId === themeId;
                        });
                        this.createOrUpdateTable();
                        this._dialogService.closeDialog();
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Theme is default!'
                        }));
                    });
            }
        });
    }

    private onDelete (themeId: number): void {
        this._dialogService.confirm({
            title: 'Theme Manager',
            content: 'Are you sure you to delete this theme?',
            callback: () => {
                this._httpService.delete(`sitecp/content/themes/${themeId}`)
                    .subscribe(() => {
                        this._data = this._data.filter(item => item.themeId !== Number(themeId));
                        this.createOrUpdateTable();
                        this._dialogService.closeDialog();
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Theme has been deleted!'
                        }));
                    });
            }
        });
    }

    private onData (data: { data: Array<Theme> }): void {
        this._data = data.data;
        this.createOrUpdateTable();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            title: 'Themes',
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.map(item => new TableRow({
            id: item.themeId.toString(),
            cells: [
                new TableCell({ title: item.title }),
                new TableCell({ title: String(item.users) }),
                new TableCell({ title: item.isDefault ? 'Yes' : 'No' }),
                new TableCell({ title: TimeHelper.getLongDateWithTime(item.updatedAt) })
            ],
            actions: this._actions
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Title' }),
            new TableHeader({ title: 'Users' }),
            new TableHeader({ title: 'Is Default' }),
            new TableHeader({ title: 'Last Modified' })
        ];
    }
}
