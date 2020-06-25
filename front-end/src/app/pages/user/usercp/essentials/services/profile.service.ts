import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ProfileModel } from '../profile/profile.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProfileService implements Resolve<ProfileModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<ProfileModel> {
        return this._httpService.get('usercp/profile')
            .pipe(map(res => new ProfileModel(res)));
    }
}
