import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BetsListPage } from '../bets/bets.model';

@Injectable()
export class BetListResolver implements Resolve<BetsListPage> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<BetsListPage> {
        const page = route.params['page'];
        const filterQuery = route.queryParams['filter'];

        return this._httpService.get(`admin/betting/bets/${page}`, { filter: filterQuery })
            .pipe(map(res => new BetsListPage(res)));
    }
}
