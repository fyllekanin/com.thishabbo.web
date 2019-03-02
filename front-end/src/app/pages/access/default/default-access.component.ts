import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';

@Component({
    selector: 'app-default-access',
    templateUrl: 'default-access.component.html'
})

export class DefaultAcccessComponent extends Page implements OnDestroy {

    constructor(
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'No access' });
    }

    ngOnDestroy(): void {
        super.destroy();
    }
}
