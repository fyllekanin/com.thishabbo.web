import { Component, TemplateRef, ViewChild } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';

@Component({
    selector: 'app-forum-post-report',
    templateUrl: 'report.component.html',

})
export class ReportComponent extends InnerDialogComponent {
    @ViewChild('infoTemplate', { static: true }) myInfoTemplate: TemplateRef<any>;

    infoModel: InfoBoxModel = {
        title: 'Warning!',
        type: INFO_BOX_TYPE.WARNING
    };

    message: string;

    getData (): string {
        return this.message;
    }

    setData () {
        // Intentionally empty
    }
}
