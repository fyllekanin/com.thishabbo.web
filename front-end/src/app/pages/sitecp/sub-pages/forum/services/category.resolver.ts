import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { CategoryPage } from '../category/category.model';
import { map } from 'rxjs/operators';

@Injectable()
export class CategoryResolver implements Resolve<CategoryPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<CategoryPage> {
        const categoryId = route.params['categoryId'];
        return this._httpService.get(`sitecp/categories/${categoryId}`)
            .pipe(map(data => new CategoryPage(data)));
    }
}
