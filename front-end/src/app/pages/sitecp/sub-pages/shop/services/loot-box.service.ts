import { Injectable } from '@angular/core';
import { LootBoxModel } from '../loot-boxes/loot-box/loot-box.model';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { SHOP_LOOT_BOXES_BREADCRUMB_ITEMS } from '../../../sitecp.constants';

@Injectable()
export class LootBoxService implements Resolve<LootBoxModel> {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _dialogService: DialogService,
        private _router: Router
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<LootBoxModel> {
        const lootBoxId = route.params['lootBoxId'];
        return this._httpService.get(`sitecp/shop/loot-boxes/${lootBoxId}`)
            .pipe(map(res => new LootBoxModel(res)));
    }

    save (lootBox: LootBoxModel): Promise<void> {
        return new Promise((res, rej) => {
            if (!lootBox.createdAt) {
                this._httpService.post('sitecp/shop/loot-boxes', { lootBox: lootBox })
                    .subscribe(() => {
                        this._notificationService.sendInfoNotification('Loot box created!');
                        res();
                    }, error => {
                        this._notificationService.failureNotification(error);
                        rej();
                    });
            } else {
                this._httpService.put(`sitecp/shop/loot-boxes/${lootBox.lootBoxId}`, { lootBox: lootBox })
                    .subscribe(() => {
                        this._notificationService.sendInfoNotification('Loot box updated!');
                        res();
                    }, error => {
                        this._notificationService.failureNotification(error);
                        rej();
                    });
            }
        });
    }

    delete (lootBoxId: number): void {
        this._dialogService.confirm({
            title: 'Are you sure?',
            content: 'Are you sure you wanna delete this loot box?',
            callback: () => {
                this._httpService.delete(`sitecp/shop/loot-boxes/${lootBoxId}`).subscribe(() => {
                    this._notificationService.sendInfoNotification('Loot box deleted');
                    this._dialogService.closeDialog();
                    this._router.navigateByUrl(SHOP_LOOT_BOXES_BREADCRUMB_ITEMS.url);
                }, this._notificationService.failureNotification.bind(this._notificationService));
            }
        });
    }
}
