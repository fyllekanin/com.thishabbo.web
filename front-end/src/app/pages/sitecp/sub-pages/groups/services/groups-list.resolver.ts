import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { GroupsListPage } from '../list/groups-list.model';
import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';

@Injectable()
export class GroupsListResolver implements Resolve<GroupsListPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<GroupsListPage> {
        const pageNr = route.params['page'];
        const filterQuery = route.queryParams['filter'];
        return this._httpService.get(`sitecp/groups/list/page/${pageNr}`, { filter: filterQuery })
            .pipe(map(data => new GroupsListPage(data)));
    }
}
