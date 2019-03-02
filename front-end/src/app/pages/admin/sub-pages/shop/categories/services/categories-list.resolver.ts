import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CategoriesListPage } from '../list/categories-list.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CategoriesListResolver implements Resolve<CategoriesListPage> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<CategoriesListPage> {
        const pageNr = route.params['page'];
        const filterQuery = route.queryParams['filter'];

        return this._httpService.get(`admin/shop/categories/page/${pageNr}`, { filter: filterQuery })
            .pipe(map(res => new CategoriesListPage(res)));
    }
}
