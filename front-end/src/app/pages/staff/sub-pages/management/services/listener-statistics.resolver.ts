import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListenerStatistics } from '../listener-statistics/listener-statistics.model';

@Injectable()
export class ListenerStatisticsResolver implements Resolve<ListenerStatistics> {

    constructor (private _httpService: HttpService) {
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<ListenerStatistics> {
        const year = activatedRouteSnapshot.params.year;
        const week = activatedRouteSnapshot.params.week;
        return this._httpService.get(`staff/radio/listener-statistics/${year}/${week}`)
            .pipe(map(res => new ListenerStatistics(res)));
    }
}
