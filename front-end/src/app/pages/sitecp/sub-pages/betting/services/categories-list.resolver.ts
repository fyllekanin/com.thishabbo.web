import { Injectable } from '@angular/core';
import { CategoriesListPage } from '../categories/categories.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CategoriesListResolver implements Resolve<CategoriesListPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<CategoriesListPage> {
        const page = route.params['page'];
        const filterQuery = route.queryParams['filter'];
        return this._httpService.get(`sitecp/betting/categories/${page}`, { filter: filterQuery })
            .pipe(map(res => new CategoriesListPage(res)));
    }
}
