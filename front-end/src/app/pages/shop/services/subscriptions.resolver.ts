import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubscriptionsPage } from '../subscriptions/subscriptions.model';

@Injectable()
export class SubscriptionsResolver implements Resolve<SubscriptionsPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<SubscriptionsPage> {
        const page = activatedRouteSnapshot.params['page'];
        return this._httpService.get(`shop/subscriptions/page/${page}`)
            .pipe(map(res => new SubscriptionsPage(res)));
    }
}
