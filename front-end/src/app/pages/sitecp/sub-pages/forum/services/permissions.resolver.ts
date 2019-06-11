import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { PermissionsPage } from '../permissions/permissions.model';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class PermissionsResolver implements Resolve<PermissionsPage> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<PermissionsPage> {
        const categoryId = route.params['categoryId'];
        const groupId = route.params['groupId'];
        return this._httpService.get(`sitecp/categories/permissions/${categoryId}/group/${groupId}`)
            .pipe(map(res => new PermissionsPage(res)));
    }
}
