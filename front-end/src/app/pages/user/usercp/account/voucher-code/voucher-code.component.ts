import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-usercp-voucher-code',
    templateUrl: 'voucher-code.component.html'
})
export class VoucherCodeComponent extends Page implements OnDestroy {

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Claim' })
    ];
    code: string;

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Voucher Code',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy() {
        super.destroy();
    }

    onClaim(): void {
        this._httpService.post('usercp/voucher-code', { code: this.code })
            .subscribe(amount => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: `You claimed ${amount} credits!`
                }));
                this.code = '';
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
