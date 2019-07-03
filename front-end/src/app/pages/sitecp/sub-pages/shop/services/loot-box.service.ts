import { Injectable } from '@angular/core';
import { LootBoxModel } from '../loot-boxes/loot-box/loot-box.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class LootBoxService implements Resolve<LootBoxModel> {

    constructor (
        private _httpService: HttpService,
        private _notifiationService: NotificationService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<LootBoxModel> {
        const lootBoxId = route.params['lootBoxId'];
        return this._httpService.get(`sitecp/shop/loot-boxes/${lootBoxId}`)
            .pipe(map(res => new LootBoxModel(res)));
    }

    save (lootBox: LootBoxModel): void {
        if (lootBox.createdAt) {
            this._httpService.post('sitecp/shop/loot-boxes', {lootBox: lootBox})
                .subscribe(() => {
                    this._notifiationService.sendInfoNotification('Loot box created!');
                }, this._notifiationService.failureNotification.bind(this._notifiationService));
        } else {
            this._httpService.put(`sitecp/shop/loot-boxes/${lootBox.lootBoxId}`, {lootBox: lootBox})
                .subscribe(() => {
                    this._notifiationService.sendInfoNotification('Loot box updated!');
                }, this._notifiationService.failureNotification.bind(this._notifiationService));
        }
    }
}
