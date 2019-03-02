import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CurrentListener } from '../current-listeners/current-listeners.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CurrentListenersResolver implements Resolve<Array<CurrentListener>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<CurrentListener>> {
        return this._httpService.get('staff/radio/current-listeners')
            .pipe(map(res => res.map(item => new CurrentListener(item))));
    }
}
