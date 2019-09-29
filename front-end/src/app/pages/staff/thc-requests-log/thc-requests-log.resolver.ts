import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';
import { ThcRequestLogPage } from './thc-requests-log.model';

@Injectable()
export class ThcRequestsResolver implements Resolve<ThcRequestLogPage> {

    constructor(private _httpService: HttpService) { }

    resolve(activatedRoute: ActivatedRouteSnapshot): Observable<ThcRequestLogPage> {
        const page = activatedRoute.params['page'];

        return this._httpService.get(`staff/thc-requests-log/page/${page}`)
            .pipe(map(res => new ThcRequestLogPage(res)));
    }
}
