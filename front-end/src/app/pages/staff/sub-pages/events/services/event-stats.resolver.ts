import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { EventStatsItem } from '../event-stats/event-stats.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class EventStatsResolver implements Resolve<Array<EventStatsItem>> {

    constructor (private _httpService: HttpService) {
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<Array<EventStatsItem>> {
        const region = activatedRouteSnapshot.queryParams['region'];

        return this._httpService.get('staff/events/stats', {
            region: region
        })
            .pipe(map(res => res.map(item => new EventStatsItem(item))));
    }
}