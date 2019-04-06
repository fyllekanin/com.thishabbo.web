import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { ActivatedRoute } from '@angular/router';
import { GroupList } from './group-list.model';

@Component({
    selector: 'app-home-group-list',
    templateUrl: 'group-list.component.html',
    styleUrls: ['group-list.component.css']
})
export class GroupListComponent extends Page implements OnDestroy {
    private _data: Array<GroupList> = [];

    constructor(
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Staff List'
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    get groups(): Array<GroupList> {
        return this._data;
    }

    private onData(data: { data: Array<GroupList> }): void {
        this._data = data.data;
    }
}
