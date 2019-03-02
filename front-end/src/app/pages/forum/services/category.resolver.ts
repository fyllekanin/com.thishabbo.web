import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { CATEGORY_SORT_BY, CategoryPage, SORT_ORDER } from '../category/category.model';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryResolver implements Resolve<CategoryPage> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<CategoryPage> {
        const sortedBy = route.queryParams['sortedBy'];
        const sortOrder = route.queryParams['sortOrder'];
        const fromThe = route.queryParams['fromThe'];
        const queryParams = this.getQueryParams(sortedBy, sortOrder, fromThe);

        const categoryId = route.params['id'];
        const page = route.params['page'];
        return this._httpService.get(`page/category/${categoryId}/page/${page}${queryParams}`)
            .pipe(map(res => new CategoryPage(res)));
    }

    private getQueryParams(sortedBy: string, sortOrder: string, fromThe: string): string {
        if (!sortedBy || !sortOrder || !fromThe) {
            return '';
        }

        if (sortOrder === SORT_ORDER.DESC && sortedBy === CATEGORY_SORT_BY.LAST_POST_TIME && fromThe === 'BEGINNING') {
            return '';
        }

        return `?sortedBy=${sortedBy}&sortOrder=${sortOrder}&fromThe=${fromThe}`;
    }
}
