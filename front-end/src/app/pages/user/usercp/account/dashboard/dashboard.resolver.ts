import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserCpDashboardModel } from './dashboard.model';

@Injectable()
export class DashboardResolver implements Resolve<UserCpDashboardModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<UserCpDashboardModel> {
        return this._httpService.get('usercp/dashboard')
            .pipe(map(item => new UserCpDashboardModel(item)));
    }
}
