import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-forum-post-report',
    templateUrl: 'report.component.html'
})
export class ReportComponent extends InnerDialogComponent {

    message: string;

    getData(): string {
        return this.message;
    }

    setData() {
        // Intentionally empty
    }
}
