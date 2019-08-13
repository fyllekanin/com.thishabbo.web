import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BadgePage } from '../badges/badges.model';

@Injectable()
export class BadgesPageResolver implements Resolve<BadgePage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<BadgePage> {
        return this._httpService.get(`page/badges/page/${route.params['page']}`)
            .pipe(map(res => new BadgePage(res)));
    }
}
