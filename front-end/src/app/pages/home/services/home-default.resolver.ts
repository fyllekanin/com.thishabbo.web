import { HttpService } from 'core/services/http/http.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeDefaultPage } from '../home-default/home-default.model';
import { map } from 'rxjs/operators';

@Injectable()
export class HomeDefaultResolver implements Resolve<HomeDefaultPage> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<HomeDefaultPage> {
        return this._httpService.get('page/home')
            .pipe(map(res => new HomeDefaultPage(res)));
    }
}
