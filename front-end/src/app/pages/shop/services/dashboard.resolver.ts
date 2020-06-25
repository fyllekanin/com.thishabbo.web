import { Injectable } from '@angular/core';
import { DashboardModel } from '../dashboard/dashboard.model';
import { HttpService } from 'core/services/http/http.service';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DashboardResolver implements Resolve<DashboardModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<DashboardModel> {
        return this._httpService.get('shop/dashboard')
            .pipe(map(res => new DashboardModel(res)));
    }
}
