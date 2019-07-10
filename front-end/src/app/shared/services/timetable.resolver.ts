import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimetablePage } from 'shared/models/timetable.model';

@Injectable()
export class TimetableResolver implements Resolve<TimetablePage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<TimetablePage> {
        const type = activatedRouteSnapshot.data['type'];
        return this._httpService.get(`${type}/timetable`)
            .pipe(map(res => new TimetablePage(res)));
    }
}
