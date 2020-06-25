import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BetPage } from '../bets/bets.model';

@Injectable()
export class BetResolver implements Resolve<BetPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<BetPage> {
        const betId = route.params['betId'];

        return this._httpService.get(`sitecp/betting/bet/${betId}`)
            .pipe(map(res => new BetPage(res)));
    }
}
