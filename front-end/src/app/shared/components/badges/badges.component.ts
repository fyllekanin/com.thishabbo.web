import { Component, Input } from '@angular/core';
import { BadgeModel } from 'shared/components/badges/badges.model';

@Component({
    selector: 'app-badges',
    templateUrl: 'badges.component.html',
    styleUrls: ['badges.component.css']
})
export class BadgesComponent {

    @Input()
    badges: Array<BadgeModel> = [];
}
