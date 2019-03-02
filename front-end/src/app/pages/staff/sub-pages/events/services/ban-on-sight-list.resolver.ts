import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BanOnSightItem } from '../ban-on-sight/ban-on-sight.model';

@Injectable()
export class BanOnSightListResolver implements Resolve<Array<BanOnSightItem>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<BanOnSightItem>> {
        return this._httpService.get(`staff/events/ban-on-sight`)
            .pipe(map(res => res.map(item => new BanOnSightItem(item))));
    }
}
