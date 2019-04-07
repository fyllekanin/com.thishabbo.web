import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-admin-user-voucher-codes-code',
    templateUrl: 'voucher-code.component.html'
})
export class VoucherCodeComponent extends InnerDialogComponent {

    note: string;
    value: number;

    getData (): { note: string, value: number } {
        return {
            note: this.note,
            value: this.value
        };
    }

    setData () {
        // Empty
    }
}
