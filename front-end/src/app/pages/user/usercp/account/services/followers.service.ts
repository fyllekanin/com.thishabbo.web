import { Injectable } from '@angular/core';
import { FollowersPage } from '../followers/followers.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FollowersService implements Resolve<FollowersPage> {

    constructor(private _httpService: HttpService) {}

    resolve (route: ActivatedRouteSnapshot): Observable<FollowersPage> {
        const page = route.params['page'];
        return this._httpService.get(`usercp/followers/page/${page}`)
            .pipe(map(res => new FollowersPage(res)));
    }
}
