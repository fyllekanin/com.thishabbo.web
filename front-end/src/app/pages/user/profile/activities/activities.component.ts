import { Component, Input } from '@angular/core';
import { Activity } from 'core/services/continues-information/continues-information.model';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-user-profile-activities',
    templateUrl: 'activities.component.html',
    styleUrls: ['activities.component.css']
})
export class ActivitiesComponent {
    @Input() activities: Array<Activity> = [];


    timeAgo(time: number): string {
        return TimeHelper.getTime(time);
    }
}
