import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ItemUsersPage } from '../items/item-users/item-users.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ItemUsersResolver implements Resolve<ItemUsersPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<ItemUsersPage> {
        const itemId = route.params['itemId'];

        return this._httpService.get(`sitecp/shop/items/${itemId}/users`)
            .pipe(map(res => new ItemUsersPage(res)));
    }
}
