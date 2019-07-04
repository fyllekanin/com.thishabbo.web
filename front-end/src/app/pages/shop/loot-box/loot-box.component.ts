import { Component, Input } from '@angular/core';
import { ShopLootBox } from '../shop.model';

@Component({
    selector: 'app-shop-loot-box',
    templateUrl: 'loot-box.component.html',
    styleUrls: ['loot-box.component.css']
})
export class LootBoxComponent {
    @Input() box = new ShopLootBox(null);
}
