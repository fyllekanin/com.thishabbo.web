import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SlimCategory } from '../forum.model';

@Injectable()
export class ForumHomeResolver implements Resolve<Array<SlimCategory>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<SlimCategory>> {
        return this._httpService.get('page/forum/categories')
            .pipe(map(res => res.map(item => new SlimCategory(item))));
    }
}
