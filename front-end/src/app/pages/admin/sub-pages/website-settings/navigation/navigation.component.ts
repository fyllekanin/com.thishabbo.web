import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { ChildItem, MainItem, NavigationItem } from 'shared/app-views/navigation/navigation.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { NavigationItemComponent } from './navigation-item/navigation-item.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { HttpService } from 'core/services/http/http.service';
import { NavigationActions } from './navigation.enum';
import { ArrayHelper } from 'shared/helpers/array.helper';

@Component({
    selector: 'app-admin-website-settings-navigation',
    templateUrl: 'navigation.component.html'
})
export class NavigationComponent extends Page implements OnDestroy {
    private _data: Array<MainItem> = [];
    private _tableConfigs: Array<TableConfig> = [];
    private _saveAction = 1;
    private _newMainItemAction = 2;

    tabs = [
        new TitleTab({ title: 'Create Main Item', value: this._newMainItemAction }),
        new TitleTab({ title: 'Save', value: this._saveAction })
    ];

    tableTabs = [
        new TitleTab({ title: 'Add Child' })
    ];

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService,
        private _dialogService: DialogService,
        private _componentResolver: ComponentFactoryResolver,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    onAction(value: number): void {
        if (value === this._saveAction) {
            this.onSave();
        } else {
            this._dialogService.openDialog({
                title: 'Adding main item',
                component: this._componentResolver.resolveComponentFactory(NavigationItemComponent),
                data: { isMainItem: true },
                buttons: [
                    new DialogCloseButton('Close'),
                    new DialogButton({
                        title: 'Add',
                        callback: item => {
                            if (this.isValid(item)) {
                                this._dialogService.closeDialog();
                                this._data.push(item);
                                this.buildTableConfigs();
                            }
                        }
                    })
                ]
            });
        }
    }

    onTableAction(action: Action): void {
        switch (action.value) {
            case NavigationActions.EDIT:
                this.editItem(action.rowId);
                break;
            case NavigationActions.REMOVE:
                this.removeItem(action.rowId);
                break;
            case NavigationActions.MOVE_UP:
                this.moveItemUp(action.rowId);
                break;
            case NavigationActions.MOVE_DOWN:
                this.moveItemDown(action.rowId);
                break;
        }
    }

    onAddChild(tableId: number): void {
        const config = this._tableConfigs.find(item => item.id === tableId);
        const mainItem = this._data.find(item => item.label === config.title);
        this._dialogService.openDialog({
            title: 'Adding child',
            component: this._componentResolver.resolveComponentFactory(NavigationItemComponent),
            data: { isMainItem: false },
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Add',
                    callback: item => {
                        if (this.isValid(item)) {
                            this._dialogService.closeDialog();
                            mainItem.children.push(item);
                            this.buildTableConfigs();
                        }
                    }
                })
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    get tableConfigs(): Array<TableConfig> {
        return this._tableConfigs;
    }

    private editItem(rowId: string): void {
        const item = this.getAllItems().find(nav => nav.id === rowId);
        this._dialogService.openDialog({
            title: 'Adding child',
            component: this._componentResolver.resolveComponentFactory(NavigationItemComponent),
            data: { isMainItem: item instanceof MainItem, item: item },
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Save',
                    callback: newItem => {
                        if (this.isValid(newItem)) {
                            this.updateItem(newItem);
                            this._dialogService.closeDialog();
                            this.buildTableConfigs();
                            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                                title: 'Success',
                                message: 'Item updated, do not forget to save!'
                            }));
                        }
                    }
                })
            ]
        });
    }

    private updateItem(newItem: NavigationItem): void {
        this._data = this._data.map(main => {
            const children = main.children.map(child => child.id === newItem.id ? <ChildItem>newItem : child);
            const newMain = main.id === newItem.id ? <MainItem>newItem : main;
            newMain.children = children;
            return newMain;
        });
    }

    private moveItemUp(rowId: string): void {
        let mainItemIndex = this._data.findIndex(item => item.id === rowId);
        if (mainItemIndex > 0) {
            this._data = ArrayHelper.move(this._data, mainItemIndex, mainItemIndex - 1);
            this.buildTableConfigs();
            return;
        } else if (mainItemIndex > -1) {
            return;
        }

        mainItemIndex = this._data.findIndex(item => {
            const childLabels = item.children.map(child => child.id);
            return childLabels.indexOf(rowId) > -1;
        });
        if (mainItemIndex > -1) {
            const childItemIndex = this._data[mainItemIndex].children.findIndex(child => child.id === rowId);
            if (childItemIndex > 0) {
                this._data[mainItemIndex].children =
                    ArrayHelper.move(this._data[mainItemIndex].children, childItemIndex, childItemIndex - 1);
            }

        }
        this.buildTableConfigs();
    }

    private moveItemDown(rowId: string): void {
        let mainItemIndex = this._data.findIndex(item => item.id === rowId);
        if (mainItemIndex < (this._data.length - 1) && mainItemIndex > -1) {
            this._data = ArrayHelper.move(this._data, mainItemIndex, mainItemIndex + 1);
            this.buildTableConfigs();
            return;
        } else if (mainItemIndex > -1) {
            return;
        }

        mainItemIndex = this._data.findIndex(item => {
            const childLabels = item.children.map(child => child.id);
            return childLabels.indexOf(rowId) > -1;
        });
        if (mainItemIndex > -1) {
            const childItemIndex = this._data[mainItemIndex].children.findIndex(child => child.id === rowId);
            if (childItemIndex < (this._data[mainItemIndex].children.length - 1)) {
                this._data[mainItemIndex].children =
                    ArrayHelper.move(this._data[mainItemIndex].children, childItemIndex, childItemIndex + 1);
            }

        }
        this.buildTableConfigs();
    }

    private onSave(): void {
        this._httpService.put('admin/content/navigation', { navigation: this._data })
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Navigation updated'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private removeItem(rowId: string): void {
        this._data = this._data.filter(mainItem => {
            mainItem.children = mainItem.children.filter(childItem => childItem.id !== rowId);
            return mainItem.id !== rowId;
        });
        this.buildTableConfigs();
    }

    private onData(data: { data: Array<MainItem> }): void {
        this._data = data.data;

        this.buildTableConfigs();
    }

    private buildTableConfigs(): void {
        const actions = [
            new TableAction({ title: 'Edit', value: NavigationActions.EDIT }),
            new TableAction({ title: 'Move Up', value: NavigationActions.MOVE_UP }),
            new TableAction({ title: 'Move Down', value: NavigationActions.MOVE_DOWN }),
            new TableAction({ title: 'Remove', value: NavigationActions.REMOVE })
        ];
        this._tableConfigs = this._data.map((item, index) => {
            return new TableConfig({
                id: index,
                title: item.label,
                headers: NavigationComponent.getTableHeaders(),
                rows: [new TableRow({
                    id: item.id,
                    cells: [
                        new TableCell({ title: item.label }),
                        new TableCell({ title: item.isHomePage ? 'Custom Home' : item.url }),
                        new TableCell({ title: `<i class="fas ${item.icon}"></i>`, innerHTML: true })
                    ],
                    actions: actions
                })].concat(item.children.map(child => new TableRow({
                    id:  child.id,
                    cells: [
                        new TableCell({ title: child.isDivider ? 'Divider' : child.label }),
                        new TableCell({ title: child.isDivider ? '' : (child.isHomePage ? 'Custom Home' : child.url) }),
                        new TableCell({ title: '' })
                    ],
                    actions: actions
                })))
            });
        });
    }

    private static getTableHeaders(): Array<TableHeader> {
        return [
            new TableHeader({ title: 'Label' }),
            new TableHeader({ title: 'Url' }),
            new TableHeader({ title: 'icon' })
        ];
    }

    private isValid(item: MainItem | ChildItem): boolean {
        if (item.isDivider) {
            return true;
        }
        const allItems = this.getAllItems();
        const urlExists = allItems.findIndex(data => data.url === item.url && data.id !== item.id) > -1;
        if (urlExists) {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Error',
                message: 'The URL already exists',
                type: NotificationType.ERROR
            }));
            return false;
        }

        const labelExists = allItems.findIndex(data => data.label === item.label && data.id !== item.id) > -1;
        if (labelExists) {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Error',
                message: 'The LABEL already exists',
                type: NotificationType.ERROR
            }));
            return false;
        }
        return  Boolean(item.url) && Boolean(item.label);
    }

    private getAllItems(): Array<NavigationItem> {
        return this._data.reduce((prev, curr) => {
            return prev.concat([<NavigationItem>curr].concat(curr.children));
        }, []);
    }
}
