import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { TimeHelper } from 'shared/helpers/time.helper';
import { Page } from 'shared/page/page.model';
import {
    STAFFCP_BREADCRUM_ITEM,
    STAFFCP_RADIO_BREADCRUM_ITEM
} from '../../../staff.constants';
import { RequestModel } from './requests.model';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';

@Component({
    selector: 'app-staff-radio-requests',
    templateUrl: 'requests.component.html'
})
export class RequestsComponent extends Page implements OnDestroy {
    private _reqeusts: Array<RequestModel> = [];

    infoModel: InfoBoxModel = {
        title: 'Hey!',
        type: INFO_BOX_TYPE.INFO,
        content: `You currently do not have any requests, tell your listeners to request!`
    };

    constructor(
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Requests',
            items: [
                STAFFCP_BREADCRUM_ITEM,
                STAFFCP_RADIO_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    getTitle(item: RequestModel): string {
        const ip = item.ip ? ` (ip: ${item.ip})` : '';
        return `Request made by: ${item.nickname} - ${TimeHelper.getTime(item.createdAt)} ${ip}`;
    }

    get requests(): Array<RequestModel> {
        return this._reqeusts;
    }

    private onData(data: { data: Array<RequestModel> }): void {
        this._reqeusts = data.data;
    }
}
