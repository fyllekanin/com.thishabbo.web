import { Injectable } from '@angular/core';
import { SearchPage } from '../search/search.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';

@Injectable()
export class SearchResolver implements Resolve<SearchPage> {

    constructor(private _httpService: HttpService) {}

    resolve (route: ActivatedRouteSnapshot): Observable<SearchPage> {
        const page = route.params['page'];
        const type = route.params['type'];
        const queryParams = route.queryParams;

        return this._httpService.get(`search/type/${type}/page/${page}`, queryParams)
            .pipe(map(res => new SearchPage(res)));
    }
}
