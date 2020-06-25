import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermShowsListPage } from '../permshow/permshow.model';

@Injectable()
export class PermShowsListResolver implements Resolve<PermShowsListPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<PermShowsListPage> {
        const pageNr = route.params['page'];
        return this._httpService.get(`staff/management/permanent-shows/page/${pageNr}`)
            .pipe(map(data => new PermShowsListPage(data)));
    }
}
