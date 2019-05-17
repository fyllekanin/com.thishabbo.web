import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { AccoladeItem, AccoladesPage, AccoladeType } from '../accolades.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-admin-users-accolades-accolade',
    templateUrl: 'accolade.component.html'
})
export class AccoladeComponent extends InnerDialogComponent {
    private _data: AccoladesPage;
    private _accolade: AccoladeItem;

    start: { month?: number, year?: number } = {};
    end: { month?: number, year?: number } = {};
    months: Array<{ label: string, number: number }> = [];

    getData () {
        this._accolade.start = new Date(`${this.start.year}-${this.start.month}-01`).getTime() / 1000;
        this._accolade.end = this.end.year && this.end.month ? new Date(`${this.end.year}-${this.end.month}-01`).getTime() / 1000 : null;
        return this._accolade;
    }

    setData (data: { data: AccoladesPage, accolade: AccoladeItem }) {
        this.months = TimeHelper.FULL_MONTHS.map((month, index) => ({label: month, number: index + 1}));
        this._data = data.data;
        this._accolade = data.accolade || new AccoladeItem(null);
        this.setStartAndEnd();
    }

    onStartMonthChange (event): void {
        this.start.month = event.target.value;
    }

    onEndMonthChange (event): void {
        this.end.month = event.target.value;
    }

    get types (): Array<AccoladeType> {
        return this._data ? this._data.types : [];
    }

    get accolade (): AccoladeItem {
        return this._accolade;
    }

    private setStartAndEnd (): void {
        if (this._accolade.start) {
            const date = new Date(this._accolade.start * 1000);
            this.start = {
                month: date.getMonth() + 1,
                year: date.getFullYear()
            };
        }

        if (this._accolade.end) {
            const date = new Date(this._accolade.end * 1000);
            this.end = {
                month: date.getMonth() + 1,
                year: date.getFullYear()
            };
        }
    }
}
