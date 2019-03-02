import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BanOnSightItem } from '../ban-on-sight/ban-on-sight.model';

@Injectable()
export class BanOnSightResolver implements Resolve<BanOnSightItem> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<BanOnSightItem> {
        const entryId = route.params['entryId'];
        return this._httpService.get(`staff/events/ban-on-sight/${entryId}`)
            .pipe(map(data => new BanOnSightItem(data)));
    }
}
