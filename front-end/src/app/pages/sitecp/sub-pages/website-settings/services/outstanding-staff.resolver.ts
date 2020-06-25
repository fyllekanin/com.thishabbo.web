import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { OutstandingStaffModel } from '../outstanding-staff/outstanding-staff.model';

@Injectable()
export class OutstandingStaffResolver implements Resolve<OutstandingStaffModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<OutstandingStaffModel> {
        return this._httpService.get('sitecp/content/outstanding-staff')
            .pipe(map(res => new OutstandingStaffModel(res)));
    }
}
