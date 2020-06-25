import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IgnoredCategory } from '../ignored-categories/ignored-categories.model';

@Injectable()
export class IgnoredCategoriesResolver implements Resolve<Array<IgnoredCategory>> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<Array<IgnoredCategory>> {
        return this._httpService.get('usercp/ignored-categories')
            .pipe(map(res => res.map(item => new IgnoredCategory(item))));
    }
}
