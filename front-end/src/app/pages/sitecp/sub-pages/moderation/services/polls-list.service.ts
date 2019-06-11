import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PollsListModel } from '../polls/list/list.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryParameters } from 'core/services/http/http.model';

@Injectable()
export class PollsListService implements Resolve<PollsListModel> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<PollsListModel> {
        const pageNr = route.params['page'];
        const filterQuery = { filter: route.queryParams['filter'] };

        return this.getPolls(filterQuery, pageNr);
    }

    getPolls(filter: QueryParameters, page: number): Observable<PollsListModel> {
        return this._httpService.get(`sitecp/moderation/polls/page/${page}`, filter)
            .pipe(map(res => new PollsListModel(res)));
    }
}
