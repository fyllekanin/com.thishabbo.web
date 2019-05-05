import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-user-profile-report',
    templateUrl: 'report.component.html'
})
export class ReportComponent extends InnerDialogComponent {

    message: string;

    getData (): string {
        return this.message;
    }

    setData () {
        // Intentionally empty
    }
}
