import { Injectable } from '@angular/core';
import { Followers, ProfileModel, ProfileVisitorMessage } from './profile.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ProfileService implements Resolve<ProfileModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<ProfileModel> {
        const nickname = route.params['nickname'];
        return this._httpService.get(`page/profile/${nickname}`)
            .pipe(map(res => new ProfileModel(res)));
    }

    follow (userId: number): Observable<Followers> {
        return this._httpService.post('usercp/profile/follow', {userId: userId});
    }

    unfollow (userId: number): Observable<Followers> {
        return this._httpService.delete(`usercp/profile/unfollow/${userId}`);
    }

    postVisitorMessage (hostId: number, value: string): Observable<ProfileVisitorMessage> {
        return this._httpService.post('profile/visitor-message', {
            data: {
                hostId: hostId,
                content: value
            }
        }).pipe(map(res => new ProfileVisitorMessage(res)));
    }
}
