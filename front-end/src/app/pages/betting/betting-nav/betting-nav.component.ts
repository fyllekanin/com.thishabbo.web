import { TitleTopBorder } from 'shared/app-views/title/title.model';
import { Component } from '@angular/core';

@Component({
    selector: 'app-betting-nav',
    templateUrl: 'betting-nav.component.html',
    styleUrls: ['betting-nav.component.css']
})
export class BettingNavComponent {
    topBorderRed = TitleTopBorder.RED;
    topBorderBlue = TitleTopBorder.BLUE;
}
