import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { TitleTab } from 'shared/app-views/title/title.model';

@Component({
    selector: 'app-school-demo',
    templateUrl: 'demo.component.html',
    styleUrls: [
        'demo.component.css'
    ]
})

export class DemoComponent extends Page implements OnDestroy {
    tabs: Array<TitleTab> = [];

    constructor (elementRef: ElementRef) {
        super(elementRef);
        this.tabs = [
            new TitleTab({
                title: 'Search'
            })
        ];
    }

    ngOnDestroy (): void {
        super.destroy();
    }
}
