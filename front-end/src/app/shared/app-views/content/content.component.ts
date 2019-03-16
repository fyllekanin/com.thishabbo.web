import { TitleTopBorder } from './../title/title.model';
import { Component, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'app-content',
    templateUrl: 'content.component.html',
    styleUrls: ['content.component.css', '../title/title.component.css']
})

export class ContentComponent {
    @ViewChild('content') contentEle;
    topBorder: TitleTopBorder = '';

    @Input()
    set top(top: TitleTopBorder) {
        this.topBorder = top || '';
    }

    @Input()
    set isContracted(value: boolean) {
        if (value) {
            // @ts-ignore
            $(this.contentEle.nativeElement).slideUp('slow');
        } else {
            // @ts-ignore
            $(this.contentEle.nativeElement).slideDown('slow');
        }
    }
}
