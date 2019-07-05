import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { LOOT_BOXES } from 'shared/constants/shop.constants';

@Component({
    selector: 'app-sitecp-shop-loot-boxes-box',
    templateUrl: 'box-selection.component.html',
    styleUrls: ['box-selection.component.css']
})
export class BoxSelectionComponent extends InnerDialogComponent {
    boxId: number;

    setData (boxId: number) {
        this.boxId = boxId;
    }

    getData (): number {
        return this.boxId;
    }

    get boxes (): Array<{ id: number, asset: string }> {
        return LOOT_BOXES;
    }
}
