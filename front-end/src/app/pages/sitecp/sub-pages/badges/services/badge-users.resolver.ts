import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { BadgeUsersModel } from '../badge-users/badge-users.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BadgeUsersResolver implements Resolve<BadgeUsersModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (activatedRoute: ActivatedRouteSnapshot): Observable<BadgeUsersModel> {
        const badgeId = activatedRoute.params['badgeId'];
        return this._httpService.get(`sitecp/badges/${badgeId}/users`)
            .pipe(map(res => new BadgeUsersModel(res)));
    }
}
