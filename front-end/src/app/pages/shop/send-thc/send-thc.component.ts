import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SHOP_HUB } from '../shop.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';

@Component({
    selector: 'app-shop-send-thc',
    templateUrl: 'send-thc.component.html'
})
export class SendThcComponent extends Page implements OnDestroy {

    infoModel: InfoBoxModel = {
        title: 'Warning!',
        type: INFO_BOX_TYPE.WARNING,
        content: `This page is used to send THC to another user. The THC you send on this page is <strong>non-refundable</strong> and there is no way
        of getting your THC back. Be sure that you are sending THC to the correct user. <br><br> <strong>ANY</strong> THC that is gained due to a breach of the rules will be removed and a penalty will be issued.`
    };

    amount: number;
    nickname: string;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Send THC' })
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
            current: 'Send THC',
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
                this._httpService.post('shop/send-thc', { amount: this.amount, nickname: this.nickname })
                    .subscribe(() => {
                        this._notificationService.sendInfoNotification('THC Sent!');
                        this.amount = 0;
                        this.nickname = '';
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }
}
