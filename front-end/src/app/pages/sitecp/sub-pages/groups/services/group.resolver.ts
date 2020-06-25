import { HttpService } from 'core/services/http/http.service';
import { Group } from '../groups.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class GroupResolver implements Resolve<Group> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<Group> {
        const groupId = route.params['groupId'];
        return this._httpService.get(`sitecp/groups/${groupId}`)
            .pipe(map(data => new Group(data)));
    }
}
