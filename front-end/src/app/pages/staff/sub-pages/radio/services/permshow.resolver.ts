import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermShow } from '../permshow/permshow.model';

@Injectable()
export class PermShowResolver implements Resolve<PermShow> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<PermShow> {
        const permShowId = route.params['permShowId'];
        return this._httpService.get(`staff/radio/permanent-shows/${permShowId}`)
            .pipe(map(data => new PermShow(data)));
    }
}
