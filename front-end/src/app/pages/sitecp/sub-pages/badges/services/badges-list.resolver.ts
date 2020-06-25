import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { BadgesListPage } from '../list/badges-list.model';
import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';

@Injectable()
export class BadgesListResolver implements Resolve<BadgesListPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<BadgesListPage> {
        const pageNr = route.params['page'];
        const filterQuery = route.queryParams['filter'];
        return this._httpService.get(`sitecp/badges/list/page/${pageNr}`, { filter: filterQuery })
            .pipe(map(data => new BadgesListPage(data)));
    }
}
