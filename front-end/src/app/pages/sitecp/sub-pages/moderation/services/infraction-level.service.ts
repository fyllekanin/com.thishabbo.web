import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { InfractionLevel } from '../infraction-levels/infraction-level.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InfractionLevelService implements Resolve<InfractionLevel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<InfractionLevel> {
        const infractionLevelId = route.params['infractionLevelId'];

        return this._httpService.get(`sitecp/moderation/infraction-levels/${infractionLevelId}`)
            .pipe(map(res => new InfractionLevel(res)));
    }
}
