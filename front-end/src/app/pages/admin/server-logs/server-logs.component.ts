import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ServerLogsService } from './server-logs.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM } from '../admin.constants';

@Component({
    selector: 'app-admin-server-logs',
    templateUrl: 'server-logs.component.html'
})
export class ServerLogsComponent extends Page implements OnDestroy {

    serverLogs: Array<string> = [];
    log: string = '';
    content: string = null;

    constructor (
        private _service: ServerLogsService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Server Logs',
            items: [
                SITECP_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onChange (event) {
        this.log = event.target.value;
        this._service.getLog(this.log).subscribe(content => {
            this.content = content || null;
        }, () => {
            this.content = null;
        });
    }

    private onData (data: { data: Array<string> }): void {
        this.serverLogs = data.data;
    }
}