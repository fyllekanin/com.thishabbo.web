import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';

@Component({
    selector: 'app-maintenance',
    templateUrl: 'maintenance.component.html'
})

export class MaintenanceComponent extends Page implements OnDestroy {
    private _content: string;

    constructor (
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'Maintenance mode' });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    get content (): string {
        return this._content;
    }

    private onData (data: { data: string }): void {
        this._content = data.data;
    }
}
