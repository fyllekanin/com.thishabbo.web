import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { BadgeArticlesPage } from '../badge-articles/badge-articles.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class BadgeArticlesResolver implements Resolve<BadgeArticlesPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<BadgeArticlesPage> {
        const page = route.params['page'];
        return this._httpService.get(`page/badge-guides/page/${page}`)
            .pipe(map(res => new BadgeArticlesPage(res)));
    }
}
