import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-betting-place-bet',
    templateUrl: 'place-bet.component.html'
})
export class PlaceBetComponent extends InnerDialogComponent {

    amount: number;

    getData () {
        return Number(this.amount);
    }

    setData () {
        // Empty
    }
}
