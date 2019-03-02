import { Injectable } from '@angular/core';
import { ProfileModel } from './profile.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ProfileService implements Resolve<ProfileModel> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ProfileModel> {
        const nickname = route.params['nickname'];
        return this._httpService.get(`page/profile/${nickname}`)
            .pipe(map(res => new ProfileModel(res)));
    }
}
