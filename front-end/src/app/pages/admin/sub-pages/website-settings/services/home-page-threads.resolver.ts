import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { HomePageThreadsPage } from '../home-page-threads/home-page-threads.model';
import { map } from 'rxjs/operators';

@Injectable()
export class HomePageThreadsResolver implements Resolve<HomePageThreadsPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<HomePageThreadsPage> {
        return this._httpService.get('admin/content/home-page-threads')
            .pipe(map(res => new HomePageThreadsPage(res)));
    }
}
