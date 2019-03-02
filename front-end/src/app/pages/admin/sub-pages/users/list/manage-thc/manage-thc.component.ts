import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-admin-users-manage-thc',
    templateUrl: 'manage-thc.component.html'
})
export class ManageThcComponent extends InnerDialogComponent {

    credits: number;

    getData() {
        return this.credits;
    }

    setData(credits: number) {
        this.credits = credits;
    }
}
