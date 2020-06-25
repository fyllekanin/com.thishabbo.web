import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BetsListPage } from '../bets/bets.model';

@Injectable()
export class BetListResolver implements Resolve<BetsListPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<BetsListPage> {
        const page = route.params['page'];
        return this._httpService.get(`sitecp/betting/bets/${page}`, route.queryParams)
            .pipe(map(res => new BetsListPage(res)));
    }
}
