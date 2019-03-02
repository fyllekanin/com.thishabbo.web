import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestModel } from '../requests/requests.model';

@Injectable()
export class RequestsResolver implements Resolve<Array<RequestModel>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<RequestModel>> {
        return this._httpService.get('staff/radio/requests')
            .pipe(map(res => {
                return res.map(item => new RequestModel(item));
            }));
    }
}
