import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DashboardModel } from './dashboard.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DashboardService implements Resolve<DashboardModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<DashboardModel> {
        const todayMidnight = new Date().setHours(0, 0, 0, 0) / 1000;
        return this._httpService.get(`admin/dashboard/${todayMidnight}`)
            .pipe(map(res => new DashboardModel(res)));
    }
}
