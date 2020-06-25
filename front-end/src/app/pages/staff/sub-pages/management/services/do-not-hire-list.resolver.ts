import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DoNotHireModel } from '../do-not-hire/do-not-hire.model';

@Injectable()
export class DoNotHireListResolver implements Resolve<DoNotHireModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<DoNotHireModel> {
        return this._httpService.get('staff/management/do-not-hire')
            .pipe(map(res => new DoNotHireModel(res)));
    }
}
