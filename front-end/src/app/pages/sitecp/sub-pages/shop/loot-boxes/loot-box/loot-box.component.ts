import { Component, ComponentFactoryResolver, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_LOOT_BOXES_BREADCRUMB_ITEMS, SITECP_BREADCRUMB_ITEM } from '../../../../sitecp.constants';
import { LootBoxActions, LootBoxItem, LootBoxModel } from './loot-box.model';
import {
    Action,
    TableAction,
    TableCell,
    TableConfig,
    TableHeader,
    TableRow
} from 'shared/components/table/table.model';
import { ShopHelper } from 'shared/helpers/shop.helper';
import { TitleTab } from 'shared/app-views/title/title.model';
import { LootBoxService } from '../../services/loot-box.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { BoxSelectionComponent } from './box-selection/box-selection.component';
import { DialogButton, DialogCloseButton } from 'shared/app-views/dialog/dialog.model';
import { ItemSelectionComponent } from './item-selection/item-selection.component';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { SHOP_ITEM_TYPES } from 'shared/constants/shop.constants';

@Component({
    selector: 'app-sitecp-shop-loot-box',
    templateUrl: 'loot-box.component.html'
})
export class LootBoxComponent extends Page implements OnDestroy {
    private _data: LootBoxModel;

    tableConfig: TableConfig;
    tabs: Array<TitleTab> = [];

    constructor (
        private _router: Router,
        private _service: LootBoxService,
        private _dialogService: DialogService,
        private _componentResolver: ComponentFactoryResolver,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Loot Box',
            items: [
                SITECP_BREADCRUMB_ITEM,
                SHOP_LOOT_BOXES_BREADCRUMB_ITEMS
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onTabClick (action: number): void {
        switch (action) {
            case LootBoxActions.SAVE:
                this._service.save(this._data).then(() => {
                    this._data.createdAt = new Date().getTime() / 1000;
                    this.setTabs();
                });
                break;
            case LootBoxActions.BACK:
                this._router.navigateByUrl('/sitecp/shop/loot-boxes/page/1');
                break;
            case LootBoxActions.DELETE:
                this._service.delete(this._data.lootBoxId);
                break;
            case LootBoxActions.ADD_ITEM:
                this._dialogService.openDialog({
                    title: 'Adding items to loot box',
                    component: this._componentResolver.resolveComponentFactory(ItemSelectionComponent),
                    data: this._data.items.map(item => item.shopItemId),
                    buttons: [
                        new DialogCloseButton('Close'),
                        new DialogButton({
                            title: 'Add',
                            callback: this.onAddItems.bind(this)
                        })
                    ]
                });
                break;
        }
    }

    onBoxSelection (): void {
        this._dialogService.openDialog({
            title: 'Box Selection',
            component: this._componentResolver.resolveComponentFactory(BoxSelectionComponent),
            data: this._data.boxId,
            buttons: [
                new DialogCloseButton('Close'),
                new DialogButton({
                    title: 'Select',
                    callback: data => {
                        this._data.boxId = data;
                        this._dialogService.closeDialog();
                    }
                })
            ]
        });
    }

    onAction (action: Action): void {
        switch (action.value) {
            case LootBoxActions.REMOVE_ITEM:
                const shopItemId = Number(action.rowId);
                this._data.items = this._data.items.filter(item => item.shopItemId !== shopItemId);
                this.createOrUpdateTable();
                break;
        }
    }

    get title (): string {
        return this._data.createdAt ?
            `Editing: ${this._data.title}` :
            `Creating: ${this._data.title}`;
    }

    get model (): LootBoxModel {
        return this._data;
    }

    private onData (data: { data: LootBoxModel }): void {
        this._data = data.data;
        this.createOrUpdateTable();
        this.setTabs();
    }

    private createOrUpdateTable (): void {
        if (this.tableConfig) {
            this.tableConfig.rows = this.getTableRows();
            return;
        }
        this.tableConfig = new TableConfig({
            isSlim: true,
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        return this._data.items.map(item => new TableRow({
            id: String(item.shopItemId),
            cells: [
                new TableCell({title: this.getResource(item), innerHTML: true}),
                new TableCell({title: item.title}),
                new TableCell({title: ShopHelper.getTypeName(item.type)}),
                new TableCell({title: ShopHelper.getRarityName(item.rarity)})
            ],
            actions: [
                new TableAction({title: 'Remove', value: LootBoxActions.REMOVE_ITEM})
            ]
        }));
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Resource'}),
            new TableHeader({title: 'Title'}),
            new TableHeader({title: 'Type'}),
            new TableHeader({title: 'Rarity'})
        ];
    }

    private setTabs (): void {
        const tabs = [
            {title: 'Save', value: LootBoxActions.SAVE, condition: true},
            {title: 'Back', value: LootBoxActions.BACK, condition: true},
            {title: 'Add Item', value: LootBoxActions.ADD_ITEM, condition: true},
            {title: 'Delete', value: LootBoxActions.DELETE, condition: this._data.createdAt}
        ];
        this.tabs = tabs.filter(tab => tab.condition).map(tab => new TitleTab(tab));
    }

    private onAddItems (items: Array<LootBoxItem>): void {
        this._data.items = this._data.items.concat(items);
        this._data.items.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'title'));
        this._dialogService.closeDialog();
        this.createOrUpdateTable();
    }

    private getResource (item: LootBoxItem): string {
        switch (item.type) {
            case SHOP_ITEM_TYPES.nameIcon.value:
            case SHOP_ITEM_TYPES.nameEffect.value:
                return `<img src="/rest/resources/images/shop/${item.shopItemId}.gif" />`;
            case SHOP_ITEM_TYPES.subscription.value:
                return '<em class="fas fa-id-card"></em>';
            default:
                return '';
        }
    }
}
