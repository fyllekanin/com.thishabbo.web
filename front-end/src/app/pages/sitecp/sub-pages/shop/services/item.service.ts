import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ShopItem } from '../items/items.model';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class ItemService implements Resolve<ShopItem> {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _httpClient: HttpClient
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<ShopItem> {
        const itemId = route.params['itemId'];

        return this._httpService.get(`sitecp/shop/items/${itemId}`)
            .pipe(map(res => new ShopItem(res)));
    }

    create (formData: FormData): Observable<ShopItem> {
        return this._httpClient.post('api/sitecp/shop/items', formData)
            .pipe(map(res => {
                this._notificationService.sendInfoNotification('Item created');
                return new ShopItem(res);
            }));
    }

    update (formData: FormData, shopItemId: number): Observable<ShopItem> {
        return this._httpClient.post(`api/sitecp/shop/items/${shopItemId}`, formData)
            .pipe(map(res => {
                this._notificationService.sendInfoNotification('Item updated');
                return new ShopItem(res);
            }));
    }

    delete (shopItemId: number): Observable<void> {
        return this._httpService.delete(`sitecp/shop/items/${shopItemId}`)
            .pipe(map(() => {
                this._notificationService.sendInfoNotification('Item deleted');
                return;
            }));
    }
}
