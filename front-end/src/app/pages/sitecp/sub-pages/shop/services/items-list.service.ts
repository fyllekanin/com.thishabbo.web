import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { QueryParameters } from 'core/services/http/http.model';
import { ShopListPage } from '../items/list/list.model';

@Injectable()
export class ItemsListService implements Resolve<ShopListPage> {

    constructor (
        private _httpService: HttpService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<ShopListPage> {
        const page = route.params['page'];

        return this.getPage(page, { filter: route.queryParams['filter'] });
    }

    getPage (page: number, filter: QueryParameters): Observable<ShopListPage> {
        return this._httpService.get(`sitecp/shop/items/page/${page}`, filter)
            .pipe(map(res => new ShopListPage(res)));
    }

    delete (shopItemId: string): Observable<void> {
        return this._httpService.delete(`sitecp/shop/items/${shopItemId}`);
    }
}
