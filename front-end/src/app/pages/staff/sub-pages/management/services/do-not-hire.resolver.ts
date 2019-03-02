import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DoNotHireItem } from '../do-not-hire/do-not-hire.model';

@Injectable()
export class DoNotHireResolver implements Resolve<DoNotHireItem> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<DoNotHireItem> {
        const entryId = route.params['entryId'];
        return this._httpService.get(`staff/management/do-not-hire/${entryId}`)
            .pipe(map(data => new DoNotHireItem(data)));
    }
}
