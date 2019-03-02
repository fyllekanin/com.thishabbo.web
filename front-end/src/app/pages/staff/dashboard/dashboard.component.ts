import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { STAFFCP_BREADCRUM_ITEM } from '../staff.constants';

@Component({
    selector: 'app-staff-dashboard',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent extends Page implements OnDestroy {

    constructor(
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Dashboard',
            items: [STAFFCP_BREADCRUM_ITEM]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }
}
