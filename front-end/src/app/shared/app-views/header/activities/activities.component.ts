import { Component, Input } from '@angular/core';
import { Activity } from 'core/services/continues-information/continues-information.model';

@Component({
    selector: 'app-header-activities',
    templateUrl: 'activities.component.html',
    styleUrls: ['activities.component.css']
})
export class ActivitiesComponent {
    private _activities: Array<Activity> = [];

    @Input()
    set activities(activities: Array<Activity>) {
        this._activities = Array.isArray(activities) ? activities : [];
    }

    get activities(): Array<Activity> {
        return this._activities;
    }
}
