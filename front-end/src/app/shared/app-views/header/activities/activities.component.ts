import { Component, Input } from '@angular/core';
import { Activity } from 'core/services/continues-information/continues-information.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';

@Component({
    selector: 'app-header-activities',
    templateUrl: 'activities.component.html',
    styleUrls: ['activities.component.css']
})
export class ActivitiesComponent {
    private _activities: Array<Activity> = [];

    isMinimalistic: boolean;

    constructor(continuesIntegrationService: ContinuesInformationService) {
        this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        continuesIntegrationService.onDeviceSettingsUpdated.subscribe(() => {
            this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        });
    }

    @Input()
    set activities(activities: Array<Activity>) {
        this._activities = Array.isArray(activities) ? activities : [];
    }

    get activities(): Array<Activity> {
        return this._activities;
    }
}
