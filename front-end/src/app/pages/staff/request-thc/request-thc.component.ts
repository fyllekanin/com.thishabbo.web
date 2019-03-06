import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Page } from 'shared/page/page.model';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { STAFFCP_BREADCRUM_ITEM } from '../staff.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { RequestThcActions, RequestThcModel } from './request-thc.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { HttpService } from 'core/services/http/http.service';

@Component({
    selector: 'app-staff-request-thc',
    templateUrl: 'request-thc.component.html',
    styleUrls: ['request-thc.component.css']
})

export class RequestThcComponent extends Page implements OnDestroy {
    private _rows: Array<RequestThcModel> = [];

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Send Request', value: RequestThcActions.SEND_REQUEST }),
        new TitleTab({ title: 'Add Row', value: RequestThcActions.ADD_ROW })
    ];

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        this._rows.push(new RequestThcModel());
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Request THC',
            items: [STAFFCP_BREADCRUM_ITEM]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    onTabClick(value: number): void {
        switch (value) {
            case RequestThcActions.ADD_ROW:
                this._rows.push(new RequestThcModel());
                break;
            case RequestThcActions.SEND_REQUEST:
                this.sendRequest();
                break;
        }
    }

    remove(itemId: string): void {
        this._rows = this._rows.filter(row => row.id !== itemId);
    }

    get rows(): Array<RequestThcModel> {
        return this._rows;
    }

    private sendRequest(): void {
        if (this.rowsAreInvalid()) {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Error',
                message: 'One or more rows are invalid',
                type: NotificationType.ERROR
            }));
        }

        this._httpService.post('staff/request-thc', { requests: this._rows })
            .subscribe(() => {
                this._rows = [new RequestThcModel()];
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Requests are sent!'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private rowsAreInvalid(): boolean {
        return this._rows.some(row => {
            return !row.nickname || isNaN(row.amount) || !row.reason;
        });
    }
}
