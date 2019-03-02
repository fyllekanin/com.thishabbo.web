import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConnectionModel } from '../connection/connection.model';

@Injectable()
export class ConnectionResolver implements Resolve<ConnectionModel> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<ConnectionModel> {
        return this._httpService.get('staff/radio/connection')
            .pipe(map(res => new ConnectionModel(res)));
    }
}
