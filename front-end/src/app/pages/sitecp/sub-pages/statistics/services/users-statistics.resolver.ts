import { Injectable } from '@angular/core';
import { UsersStatisticsModel } from '../users-statistics/users-statistics.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UsersStatisticsResolver implements Resolve<UsersStatisticsModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<UsersStatisticsModel> {
        const year = route.params['year'];
        const month = route.params['month'];
        return this._httpService.get(`sitecp/statistics/users/${year}/${month}`)
            .pipe(map(res => new UsersStatisticsModel(res)));
    }
}
