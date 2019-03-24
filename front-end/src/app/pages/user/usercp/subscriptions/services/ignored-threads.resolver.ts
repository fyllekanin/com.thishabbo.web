import { Injectable } from '@angular/core';
import { IgnoredThread } from '../ignored-threads/ignored-threads.model';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class IgnoredThreadsResolver implements Resolve<Array<IgnoredThread>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<IgnoredThread>> {
        return this._httpService.get('usercp/ignored-threads')
            .pipe(map(res => res.map(item => new IgnoredThread(item))));
    }
}
