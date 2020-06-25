import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-sitecp-users-credits-dialog',
    templateUrl: 'credits-dialog.component.html'
})
export class CreditsDialogComponent extends InnerDialogComponent {
    credits: number;

    getData () {
        return {
            credits: this.credits
        };
    }

    setData (credits: number) {
        this.credits = Number(credits);
    }
}
