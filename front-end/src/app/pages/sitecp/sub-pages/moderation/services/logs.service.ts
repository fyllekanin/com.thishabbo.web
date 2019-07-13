import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { LogPage } from '../logs/logs.model';

@Injectable()
export class LogsService implements Resolve<LogPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<LogPage> {
        const type = route.params['type'];
        const pageNr = route.params['page'];

        const action = route.queryParams['action'];
        const user = route.queryParams['user'];

        return this._httpService.get(`sitecp/logs/${type}/page/${pageNr}`, {
            action: action,
            user: user
        })
            .pipe(map(res => new LogPage(res)));
    }
}
