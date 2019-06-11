import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { StaffOfTheWeekModel } from '../staff-of-the-week/staff-of-the-week.model';

@Injectable()
export class StaffOfTheWeekResolver implements Resolve<StaffOfTheWeekModel> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<StaffOfTheWeekModel> {
        return this._httpService.get('sitecp/content/staff-of-the-week')
            .pipe(map(res => new StaffOfTheWeekModel(res)));
    }
}
