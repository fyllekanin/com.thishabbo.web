import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { BetModel } from '../../bets.model';

@Component({
    selector: 'app-admin-betting-bet-result',
    templateUrl: 'result.component.html'
})
export class ResultComponent extends InnerDialogComponent {
    private _bet: BetModel;

    get bet(): BetModel {
        return this._bet;
    }

    getData() {
        return this._bet;
    }

    setData(bet: BetModel) {
        this._bet = bet;
    }
}
