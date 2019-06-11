import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryParameters } from 'core/services/http/http.model';
import { AutoBansListPage } from '../auto-bans/list/auto-bans.model';

@Injectable()
export class AutoBansService implements Resolve<AutoBansListPage> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<AutoBansListPage> {
        const pageNr = route.params['page'];
        const filterQuery = { filter: route.queryParams['filter'] };

        return this.getData(filterQuery, pageNr);
    }

    getData(filter: QueryParameters, page: number): Observable<AutoBansListPage> {
        return this._httpService.get(`sitecp/moderation/auto-bans/page/${page}`, filter)
            .pipe(map(res => new AutoBansListPage(res)));
    }
}
