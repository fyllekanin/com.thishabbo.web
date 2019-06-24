import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ChangeHistoryPage } from '../change-history/change-history.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ChangeHistoryResolver implements Resolve<ChangeHistoryPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<ChangeHistoryPage> {
        const page = route.params['page'];
        const userId = route.params['userId'];

        return this._httpService.get(`sitecp/users/${userId}/history/page/${page}`)
            .pipe(map(res => new ChangeHistoryPage(res)));
    }
}