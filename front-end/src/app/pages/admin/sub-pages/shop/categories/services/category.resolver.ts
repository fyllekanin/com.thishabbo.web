import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CategoryModel } from '../category/category.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CategoryResolver implements Resolve<CategoryModel> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<CategoryModel> {
        const shopCategoryId = route.params['shopCategoryId'];

        return shopCategoryId === 'new' ? of(new CategoryModel()) : this._httpService.get(`admin/shop/categories/${shopCategoryId}`)
            .pipe(map(res => new CategoryModel(res)));
    }
}
