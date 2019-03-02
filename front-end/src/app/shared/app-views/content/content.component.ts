import { TitleTopBorder } from './../title/title.model';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-content',
    templateUrl: 'content.component.html',
    styleUrls: ['content.component.css', '../title/title.component.css']
})

export class ContentComponent {
    @HostBinding('class.contracted') @Input() isContracted = false;

    topBorder: TitleTopBorder = '';

    @Input()
    set top(top: TitleTopBorder) {
        this.topBorder = top || '';
    }
}
