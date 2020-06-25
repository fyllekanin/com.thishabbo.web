import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { IReason } from './reason.model';

@Component({
    selector: 'app-sitecp-user-ban-reason',
    templateUrl: 'reason.component.html'
})
export class ReasonComponent extends InnerDialogComponent {
    data: IReason;

    setData (data: IReason) {
        this.data = data;
    }

    getData (): IReason {
        return this.data;
    }
}
