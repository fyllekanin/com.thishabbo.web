import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { PageModel } from '../../admin/sub-pages/website-settings/pages/page.model';

@Component({
    selector: 'app-home-custom-page',
    templateUrl: 'custom-page.component.html'
})
export class CustomPageComponent extends Page implements OnDestroy {
    private _data: PageModel = new PageModel();

    constructor(
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: activatedRoute.snapshot.params['page'],
            items: []
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    get title(): string {
        return this._data.title;
    }

    get content(): string {
        return this._data.content;
    }

    private onData(data: { data: PageModel }): void {
        this._data = data.data;
    }
}
