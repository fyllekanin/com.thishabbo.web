import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LatestThreadsPage } from '../latest-threads/latest-threads.model';

@Injectable()
export class LatestThreadsResolver implements Resolve<LatestThreadsPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<LatestThreadsPage> {
        const page = route.params['page'];

        return this._httpService.get(`page/forum/latest-threads/page/${page}`)
            .pipe(map(res => new LatestThreadsPage(res)));
    }
}
