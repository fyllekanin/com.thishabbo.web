import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-betting',
    template: `
    <div class="grid-container full">
        <div class="grid-x margin-x">
            <div class="cell small-12 medium-9">
                <router-outlet></router-outlet>
            </div>
            <div class="cell small-12 medium-3">
                <app-betting-nav></app-betting-nav>
            </div>
        </div>
    </div>`
})

export class BettingComponent extends Page implements OnDestroy {

    constructor(breadcrumbService: BreadcrumbService, elementRef: ElementRef) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'Betting Hub' });
    }

    ngOnDestroy(): void {
        super.destroy();
    }
}
