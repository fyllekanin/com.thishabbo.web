import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventTypesPage } from '../types/types.model';

@Injectable()
export class TypesReolver implements Resolve<EventTypesPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (activatedRoute: ActivatedRouteSnapshot): Observable<EventTypesPage> {
        const page = activatedRoute.params['page'];
        const filterQuery = activatedRoute.queryParams['filter'];
        return this._httpService.get(`staff/events/types/page/${page}`, { filter: filterQuery })
            .pipe(map(res => new EventTypesPage(res)));
    }
}
