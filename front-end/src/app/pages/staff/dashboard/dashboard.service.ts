import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { TimeHelper } from 'shared/helpers/time.helper';
import { map } from 'rxjs/operators';
import { DashboardPage } from './dashboard.model';

@Injectable()
export class DashboardService implements Resolve<DashboardPage> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<DashboardPage> {
        return this._httpService.get('staff/dashboard/' + TimeHelper.getStartOfWeek())
            .pipe(map(res => new DashboardPage(res)));
    }
}
