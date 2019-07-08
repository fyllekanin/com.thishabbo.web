import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { LogItem } from '../logs.model';

@Component({
    selector: 'app-sitecp-moderation-log-details',
    templateUrl: 'log-details.component.html'
})
export class LogDetailsComponent extends InnerDialogComponent {
    private _data: LogItem;

    getData () {
        // Empty
    }

    setData (data: LogItem) {
        this._data = data;
    }

    get data (): object {
        return this._data.data;
    }

}
