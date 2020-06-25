import { Component, Input } from '@angular/core';
import { Activity } from 'core/services/continues-information/continues-information.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';

@Component({
    selector: 'app-header-activities',
    templateUrl: 'activities.component.html',
    styleUrls: [ 'activities.component.css' ]
})
export class ActivitiesComponent {
    @Input() activities: Array<Activity> = [];
    isMinimalistic: boolean;

    constructor (continuesIntegrationService: ContinuesInformationService) {
        this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        continuesIntegrationService.onDeviceSettingsUpdated.subscribe(() => {
            this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        });
    }

    trackLogs (_index: number, item: Activity): number {
        return item.logId;
    }
}
