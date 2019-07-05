import { Injectable } from '@angular/core';
import { DashboardPage } from '../dashboard/dashboardPage';
import { HttpService } from 'core/services/http/http.service';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DashboardResolver implements Resolve<DashboardPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<DashboardPage> {
        return this._httpService.get('shop/dashboard')
            .pipe(map(res => new DashboardPage(res)));
    }
}
