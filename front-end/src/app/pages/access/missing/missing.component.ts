import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';

@Component({
    selector: 'app-missing',
    templateUrl: 'missing.component.html'
})

export class MissingComponent extends Page implements OnDestroy {

    constructor (
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({current: 'Missing'});
    }

    ngOnDestroy () {
        super.destroy();
    }
}
