import { Injectable } from '@angular/core';
import { PageModel } from '../pages/page.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PageResolver implements Resolve<PageModel> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<PageModel> {
        const pageId = route.params['pageId'];
        return pageId === 'new' ? of(new PageModel()) : this._httpService.get(`admin/content/pages/${pageId}`)
            .pipe(map(res => new PageModel(res)));
    }
}
