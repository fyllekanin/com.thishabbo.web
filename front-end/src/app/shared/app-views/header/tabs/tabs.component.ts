import { Component, ComponentFactoryResolver } from '@angular/core';
import { DialogService } from 'core/services/dialog/dialog.service';
import { TabModel } from 'shared/app-views/header/tabs/tabs.model';
import { TabComponent } from 'shared/app-views/header/tabs/tab/tab.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';

@Component({
    selector: 'app-header-tabs',
    templateUrl: 'tabs.component.html',
    styleUrls: ['tabs.component.css']
})
export class TabsComponent {
    private _tabs: Array<TabModel> = [];

    constructor(
        private _dialogService: DialogService,
        private _componentResolver: ComponentFactoryResolver,
        private _globalNotificationService: GlobalNotificationService,
        continuesInformationService: ContinuesInformationService
    ) {
        this.updateTabs();
        continuesInformationService.onTabsUpdated.subscribe(this.updateTabs.bind(this));
    }

    onCreateNew(): void {
        this._dialogService.openDialog({
            title: 'Creating Tab',
            component: this._componentResolver.resolveComponentFactory(TabComponent),
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Save',
                    callback: this.onSaveTab.bind(this)
                })
            ]
        });
    }

    get tabs(): Array<TabModel> {
        return this._tabs;
    }

    onSaveTab(tab: TabModel): void {
        if (!tab.label) {
            this.printError('Label needs to be set');
            return;
        }

        if (!tab.url) {
            this.printError('URL needs to be set');
            return;
        }

        const labelExists = this._tabs
            .some(item => item.label.toLowerCase() === tab.label.toLowerCase());
        if (labelExists) {
            this.printError('Label already exist');
        }

        const urlExists = this._tabs
            .some(item => item.url.toLowerCase() === tab.url.toLowerCase());
        if (urlExists) {
            this.printError('URL already exist');
        }

        this._dialogService.closeDialog();
        this._tabs.push(tab);
        this.updateLocalstorage();
    }

    private printError(message: string): void {
        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
            title: 'Error',
            message: message,
            type: NotificationType.ERROR
        }));
        return;
    }

    private updateLocalstorage(): void {
        localStorage.setItem(LOCAL_STORAGE.TABS, JSON.stringify(this._tabs));
    }

    private updateTabs(): void {
        try {
            this._tabs = JSON.parse(localStorage.getItem(LOCAL_STORAGE.TABS))
                .map(item => new TabModel(item));
        } catch (e) {
            this._tabs = [];
        }
    }
}
