import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-page',
    styles: [ ':host { display: block; }' ],
    template: `
        <router-outlet></router-outlet>
    `
})

export class PageComponent extends Page implements OnDestroy {

    constructor (elementRef: ElementRef) {
        super(elementRef);
    }

    ngOnDestroy (): void {
        super.destroy();
    }
}
