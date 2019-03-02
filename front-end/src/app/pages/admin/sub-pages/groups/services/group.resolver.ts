import { HttpService } from 'core/services/http/http.service';
import { Group } from '../groups.model';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class GroupResolver implements Resolve<Group> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Group> {
        const groupId = route.params['groupId'];
        return this._httpService.get(`admin/groups/${groupId}`)
            .pipe(map(data => new Group(data)));
    }
}
