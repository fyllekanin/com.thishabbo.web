import { Injectable } from '@angular/core';
import { User } from 'core/services/auth/auth.model';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class EssentialsService implements Resolve<User> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<User> {
        const userId = route.params['userId'];
        return this._httpService.get(`sitecp/users/${userId}/essentials`)
            .pipe(map(res => new User(res)));
    }
}
