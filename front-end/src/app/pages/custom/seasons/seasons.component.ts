import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';

@Component({
    selector: 'app-custom-seasons',
    templateUrl: 'seasons.component.html',
    styleUrls: [ 'seasons.component.css' ]
})
export class SeasonsComponent extends Page implements OnDestroy {

    constructor (
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'Leader board' });
    }

    ngOnDestroy () {
        super.destroy();
    }
}
