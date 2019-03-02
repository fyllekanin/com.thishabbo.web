import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ListCategory } from '../list/categories-list.model';

@Injectable()
export class CategoriesListResolver implements Resolve<Array<ListCategory>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<ListCategory>> {
        return this._httpService.get(`admin/categories`)
            .pipe(map(data => {
                return data.map(res => new ListCategory(res));
            }));
    }
}
