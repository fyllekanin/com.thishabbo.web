import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { TitleTab } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-school-jxsh',
    templateUrl: 'jxsh.component.html',
    styleUrls: [
        'jxsh.component.css'
    ]
})
export class JxshComponent extends Page implements OnDestroy {

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Search' })
    ];

    constructor (elementRef: ElementRef) {
        super(elementRef);
    }

    ngOnDestroy (): void {
        super.destroy();
    }
}
