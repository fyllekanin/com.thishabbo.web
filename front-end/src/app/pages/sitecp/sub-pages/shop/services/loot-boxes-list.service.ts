import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { QueryParameters } from 'core/services/http/http.model';
import { LootBoxesListPage } from '../loot-boxes/loot-boxes-list/loot-boxes-list.model';

@Injectable()
export class LootBoxesListService implements Resolve<LootBoxesListPage> {

    constructor (
        private _httpService: HttpService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<LootBoxesListPage> {
        const page = route.params['page'];

        return this.getPage(page, {filter: route.queryParams['filter']});
    }

    getPage (page: number, filter: QueryParameters): Observable<LootBoxesListPage> {
        return this._httpService.get(`sitecp/shop/loot-boxes/page/${page}`, filter)
            .pipe(map(res => new LootBoxesListPage(res)));
    }

    delete (lootBoxId: string): Observable<void> {
        return this._httpService.delete(`sitecp/shop/loot-boxes/${lootBoxId}`);
    }
}
