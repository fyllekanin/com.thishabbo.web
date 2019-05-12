import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SayResolver implements Resolve<string> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<string> {
        return this._httpService.get('staff/events/say')
            .pipe(map(res => res));
    }
}
