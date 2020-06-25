import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThreadsStatisticsModel } from '../threads-statistics/threads-statistics.model';

@Injectable()
export class ThreadsStatisticsResolver implements Resolve<ThreadsStatisticsModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<ThreadsStatisticsModel> {
        const year = route.params['year'];
        const month = route.params['month'];
        return this._httpService.get(`sitecp/statistics/threads/${year}/${month}`)
            .pipe(map(res => new ThreadsStatisticsModel(res)));
    }
}
