import { Component, Input } from '@angular/core';
import { RotatedItem } from '../../dashboard/dashboard.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';

@Component({
    selector: 'app-shop-rotated-item',
    templateUrl: 'rotated-item.component.html',
    styleUrls: [ 'rotated-item.component.css' ]
})
export class RotatedItemComponent {
    @Input() item = new RotatedItem(null);

    constructor (
        private _dialogService: DialogService,
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    onBuy (): void {
        this._dialogService.confirm({
            title: `Are you sure?`,
            content: `You are buying ${this.item.title} for ${this.item.credits} thc`,
            callback: () => {
                this._httpService.post(`shop/buy-rotated-item/${this.item.shopItemId}`, null)
                    .subscribe(() => {
                        this._notificationService.sendInfoNotification('Item bought!');
                        this._dialogService.closeDialog();
                    }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }
}
