import { Injectable } from '@angular/core';
import { InfractionsPage } from '../infractions/infractions.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';

@Injectable()
export class InfractionsResolver implements Resolve<InfractionsPage> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<InfractionsPage> {
        const pageNr = route.params['page'];
        const filterQuery = { filter: route.queryParams['filter'] };

        return this._httpService.get(`sitecp/moderation/infractions/page/${pageNr}`, filterQuery)
            .pipe(map(res => new InfractionsPage(res)));
    }
}
