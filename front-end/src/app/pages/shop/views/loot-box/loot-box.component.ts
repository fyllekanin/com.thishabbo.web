import { Component, ComponentFactoryResolver, Input } from '@angular/core';
import { ShopLootBox } from '../../shop.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { LootBoxDetailsComponent } from './loot-box-details/loot-box-details.component';
import { DialogCloseButton } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-shop-loot-box',
    templateUrl: 'loot-box.component.html',
    styleUrls: ['loot-box.component.css']
})
export class LootBoxComponent {
    @Input() box = new ShopLootBox(null);

    constructor (
        private _dialogService: DialogService,
        private _componentResolver: ComponentFactoryResolver
    ) {
    }

    details (): void {
        this._dialogService.openDialog({
            title: `${this.box.title} - ${this.box.credits} THC`,
            component: this._componentResolver.resolveComponentFactory(LootBoxDetailsComponent),
            data: this.box,
            buttons: [
                new DialogCloseButton('Close')
            ]
        });
    }
}
