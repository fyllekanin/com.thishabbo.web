import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { LootBoxResponse, ShopLootBox } from '../../../shop.model';
import { TableCell, TableConfig, TableHeader, TableRow } from 'shared/components/table/table.model';
import { ShopHelper } from 'shared/helpers/shop.helper';
import { SHOP_ITEM_TYPES } from 'shared/constants/shop.constants';
import { ArrayHelper } from 'shared/helpers/array.helper';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-shop-loot-box-details',
    templateUrl: 'loot-box-details.component.html',
    styleUrls: ['loot-box-details.component.css']
})
export class LootBoxDetailsComponent extends InnerDialogComponent {
    box = new ShopLootBox(null);
    tableConfig: TableConfig;

    response: LootBoxResponse;

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
        super();
    }

    getData () {
        // Empty
    }

    setData (data: ShopLootBox) {
        this.box = data;
        this.createTableConfig();
    }

    open (): void {
        this._httpService.post(`shop/loot-boxes/open/${this.box.lootBoxId}`, null)
            .subscribe(res => {
                this.response = new LootBoxResponse(res);
                this._notificationService.sendInfoNotification('Loot box opened!');
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    private createTableConfig (): void {
        this.tableConfig = new TableConfig({
            isSlim: true,
            headers: this.getTableHeaders(),
            rows: this.getTableRows()
        });
    }

    private getTableRows (): Array<TableRow> {
        this.box.items.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'rarity'));
        return this.box.items.map(item => {
            const itemId = item.type === SHOP_ITEM_TYPES.badge.value ? item.data.badgeId : item.shopItemId;
            return new TableRow({
                id: String(item.shopItemId),
                cells: [
                    new TableCell({
                        title: ShopHelper.getItemResource(itemId, item.type),
                        innerHTML: true
                    }),
                    new TableCell({
                        title: `<span style="font-weight: bold; color: ${item.color}">${item.title}</span>`,
                        innerHTML: true
                    }),
                    new TableCell({
                        title: item.type === SHOP_ITEM_TYPES.subscription.value ?
                            this.getExpireAfter(item.data.subscriptionTime) : ''
                    }),
                    new TableCell({
                        title: item.owns ? 'Yes' : 'No'
                    })
                ]
            });
        });
    }

    private getExpireAfter (time: number): string {
        switch (time) {
            case 3600:
                return 'One Hour';
            case 86400:
                return 'One Day';
            case 604800:
                return 'One Week';
            case 2419200:
                return 'One Month';
            default:
                return '';
        }
    }

    private getTableHeaders (): Array<TableHeader> {
        return [
            new TableHeader({title: 'Resource'}),
            new TableHeader({title: 'Item'}),
            new TableHeader({title: 'Details'}),
            new TableHeader({title: 'Owns'})
        ];
    }
}
