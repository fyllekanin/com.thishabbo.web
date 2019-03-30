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
        return this._tab;
    }

    setData () {
        // Intentionally empty
    }

    get tab(): TabModel {
        return this._tab;
    }
}
