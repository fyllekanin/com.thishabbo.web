import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ServerLogsService implements Resolve<Array<string>> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<Array<string>> {
        return this._httpService.get('admin/server-logs')
            .pipe(map(res => res));
    }

    getLog (log: string): Observable<string> {
        return this._httpService.get(`admin/server-logs/${log}`)
            .pipe(map(res => res));
    }
}
