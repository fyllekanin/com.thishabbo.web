import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { BetCategoryModel } from '../categories/categories.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CategoryResolver implements Resolve<BetCategoryModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<BetCategoryModel> {
        const betCategoryId = route.params['betCategoryId'];
        return this._httpService.get(`sitecp/betting/category/${betCategoryId}`)
            .pipe(map(res => new BetCategoryModel(res)));
    }
}
