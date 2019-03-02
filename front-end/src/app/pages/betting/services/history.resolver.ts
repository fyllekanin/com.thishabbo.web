import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HistoryModel } from '../history/history.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HistoryResolver implements Resolve<HistoryModel> {

    constructor(private _httpService: HttpService) {}

    resolve(activatedRoute: ActivatedRouteSnapshot): Observable<HistoryModel> {
        const page = activatedRoute.params['page'];
        return this._httpService.get(`betting/bets/history/page/${page}`)
            .pipe(map(res => new HistoryModel(res)));
    }
}
