import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_HUB } from '../shop.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';

@Component({
    selector: 'app-shop-send-thc',
    templateUrl: 'send-thc.component.html'
})
export class SendThcComponent extends Page implements OnDestroy {

    amount: number;
    nickname: string;
    tabs: Array<TitleTab> = [
        new TitleTab({title: 'Send THC'})
    ];

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Send Thc',
            items: [
                SHOP_HUB
            ]
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onSendThc (): void {
        this._dialogService.confirm({
            title: 'Are you sure?',
            content: `Are you sure you wanna send <strong>${this.amount} THC</strong> to user <strong>${this.nickname}</strong> ?`,
            callback: () => {
                this._dialogService.closeDialog();
                this._httpService.post('shop/send-thc', {amount: this.amount, nickname: this.nickname})
                    .subscribe(() => {
                        this._notificationService.sendInfoNotification('THC Sent!');
                        this.amount = 0;
                        this.nickname = '';
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }
}
