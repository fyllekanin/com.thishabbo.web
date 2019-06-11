import { HttpService } from 'core/services/http/http.service';
import { Badge } from '../badges.model';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class BadgeResolver implements Resolve<Badge> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Badge> {
        const badgeId = route.params['badgeId'];
        return badgeId === 'new' ? of(new Badge()) : this._httpService.get(`sitecp/badges/${badgeId}`)
            .pipe(map(data => new Badge(data)));
    }
}
