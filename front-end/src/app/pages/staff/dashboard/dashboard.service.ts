import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { TimeHelper } from 'shared/helpers/time.helper';
import { map } from 'rxjs/operators';
import { DashboardPage } from './dashboard.model';

@Injectable()
export class DashboardService implements Resolve<DashboardPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<DashboardPage> {
        const date = new Date();
        const year = activatedRouteSnapshot.params['year'] || date.getFullYear();
        const month = activatedRouteSnapshot.params['month'] || date.getMonth() + 1;
        return this._httpService.get(`staff/dashboard/${TimeHelper.getStartOfWeek()}/${year}/${month}/points`)
            .pipe(map(res => new DashboardPage(res)));
    }
}
