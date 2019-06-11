import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Theme, ThemeActions } from '../theme.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import {
    SITECP_BREADCRUMB_ITEM,
    THEMES_BREADCRUMB_ITEM,
    WEBSITE_SETTINGS_BREADCRUMB_ITEM
} from '../../../../sitecp.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-sitecp-website-settings-theme',
    templateUrl: 'theme.component.html',
    styleUrls: ['theme.component.css']
})
export class ThemeComponent extends Page implements OnDestroy {
    private _data: Theme;

    tabs: Array<TitleTab> = [];

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
            current: 'Theme',
            items: [
                SITECP_BREADCRUMB_ITEM,
                WEBSITE_SETTINGS_BREADCRUMB_ITEM,
                THEMES_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onTabClick (action: number): void {
        switch (action) {
            case ThemeActions.SAVE:
                this.onSave();
                break;
            case ThemeActions.DEFAULT:
                this.onDelete();
                break;
            case ThemeActions.BACK:
                this._router.navigateByUrl('/sitecp/website-settings/themes');
                break;
        }
    }

    get model (): Theme {
        return this._data;
    }

    get title (): string {
        return this._data.createdAt ? `Editing: ${this._data.title}` : `Creating: ${this._data.title}`;
    }

    private onSave (): void {
        if (this._data.createdAt) {
            this._httpService.put(`sitecp/content/themes/${this._data.themeId}`, {theme: this._data})
                .subscribe(() => {
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: 'Theme is created!'
                    }));
                }, this._notificationService.failureNotification.bind(this._notificationService));
        } else {
            this._httpService.post('sitecp/content/themes', {theme: this._data})
                .subscribe(() => {
                    this._data.createdAt = new Date().getTime() / 1000;
                    this.updateTabs();
                    this._notificationService.sendNotification(new NotificationMessage({
                        title: 'Success',
                        message: 'Theme is created!'
                    }));
                }, this._notificationService.failureNotification.bind(this._notificationService));
        }
    }

    private onDelete (): void {
        this._dialogService.confirm({
            title: 'Are you sure?',
            content: 'Are you sure you wanna delete this theme?',
            callback: () => {
                this._httpService.delete(`sitecp/content/themes/${this._data.themeId}`)
                    .subscribe(() => {
                        this._notificationService.sendNotification(new NotificationMessage({
                            title: 'Success',
                            message: 'Theme is deleted!'
                        }));
                        this._dialogService.closeDialog();
                        this._router.navigateByUrl('/sitecp/website-settings/themes');
                    });
            }
        });
    }

    private onData (data: { data: Theme }): void {
        this._data = data.data;
        this.updateTabs();
    }

    private updateTabs (): void {
        const tabs = [
            {title: 'Save', value: ThemeActions.SAVE, condition: true},
            {title: 'Delete', value: ThemeActions.DELETE, condition: this._data.createdAt},
            {title: 'Back', value: ThemeActions.BACK, condition: true}
        ];
        this.tabs = tabs.filter(item => item.condition).map(item => new TitleTab(item));
    }
}
