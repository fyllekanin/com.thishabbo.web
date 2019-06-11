import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { GroupList } from '../groups-list/groups-list.model';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';


@Injectable()
export class GroupsListResolver implements Resolve<Array<GroupList>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<GroupList>> {
        return this._httpService.get('sitecp/content/groupslist')
            .pipe(map((res: Array<any>) => res.map(item => new GroupList(item))));
    }
}
