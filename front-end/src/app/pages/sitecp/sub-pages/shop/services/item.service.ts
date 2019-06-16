import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ShopItem } from '../items/items.model';

@Injectable()
export class ItemService implements Resolve<ShopItem> {

    constructor (
        private _httpService: HttpService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<ShopItem> {
        const itemId = route.params['itemId'];

        return this._httpService.get(`sitecp/shop/items/${itemId}`)
            .pipe(map(res => new ShopItem(res)));
    }
}
