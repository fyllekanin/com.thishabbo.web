import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DashboardModel } from '../dashboard/dashboard.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DashboardResolver implements Resolve<DashboardModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<DashboardModel> {
        return this._httpService.get('betting/dashboard')
            .pipe(map(res => new DashboardModel(res)));
    }
}
