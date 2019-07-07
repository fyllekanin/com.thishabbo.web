import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { TabModel } from 'shared/app-views/header/tabs/tabs.model';

@Component({
    selector: 'app-header-tabs-tab',
    templateUrl: 'tab.component.html'
})
export class TabComponent extends InnerDialogComponent {
    private _tab = new TabModel({});

    getData () {
        if (this._tab.url.indexOf(location.origin) > -1) {
            this._tab.url = this._tab.url.replace(location.origin, '');
        }
        return this._tab;
    }

    setData () {
        // Intentionally empty
    }

    get tab (): TabModel {
        return this._tab;
    }
}
