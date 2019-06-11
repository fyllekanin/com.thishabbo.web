import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { InfractionLevelsListPage } from '../infraction-levels/list/infraction-levels-list.model';
import { Observable } from 'rxjs';
import { QueryParameters } from 'core/services/http/http.model';
import { map } from 'rxjs/operators';

@Injectable()
export class InfractionLevelsService implements Resolve<InfractionLevelsListPage> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<InfractionLevelsListPage> {
        const pageNr = route.params['page'];
        const filterQuery = { filter: route.queryParams['filter'] };

        return this.getData(filterQuery, pageNr);
    }

    getData(filter: QueryParameters, page: number): Observable<InfractionLevelsListPage> {
        return this._httpService.get(`sitecp/moderation/infraction-levels/page/${page}`, filter)
            .pipe(map(res => new InfractionLevelsListPage(res)));
    }
}
