import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestsPage } from '../requests/requests.model';

@Injectable()
export class RequestsResolver implements Resolve<RequestsPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<RequestsPage> {
        return this._httpService.get('staff/radio/requests')
            .pipe(map(res => new RequestsPage(res)));
    }
}
