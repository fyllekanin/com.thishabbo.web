import { Injectable } from '@angular/core';
import { StatsModel } from '../../betting/betting.model';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';

@Injectable()
export class ArcadeDefaultResolver implements Resolve<StatsModel> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<StatsModel> {
        return this._httpService.get('betting/stats')
            .pipe(map(res => new StatsModel(res)));
    }
}
