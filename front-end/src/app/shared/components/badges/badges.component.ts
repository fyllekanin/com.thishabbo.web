import { Component, Input } from '@angular/core';
import { BadgeModel } from 'shared/components/badges/badges.model';

@Component({
    selector: 'app-badges',
    templateUrl: 'badges.component.html',
    styleUrls: [ 'badges.component.css' ]
})
export class BadgesComponent {

    @Input() size = 'small-6 medium-3';

    @Input()
    badges: Array<BadgeModel> = [];
}
