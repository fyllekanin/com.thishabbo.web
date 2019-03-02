import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MemberOfTheMonthModel } from '../member-of-the-month/member-of-the-month.model';

@Injectable()
export class MemberOfTheMonthResolver implements Resolve<MemberOfTheMonthModel> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<MemberOfTheMonthModel> {
        return this._httpService.get('admin/content/member-of-the-month')
            .pipe(map(res => new MemberOfTheMonthModel(res)));
    }
}
