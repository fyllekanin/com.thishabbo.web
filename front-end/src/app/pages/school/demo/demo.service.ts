import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { SlimUser } from 'core/services/auth/auth.model';
import { map } from 'rxjs/operators';

@Injectable()
export class DemoService {

    constructor (
        private _httpService: HttpService
    ) {
    }

    searchUsers (nickname: string): Observable<Array<SlimUser>> {
        return this._httpService.get('school/demo/search-users', {
            nickname: nickname
        }).pipe(map(data => data.map(user => new SlimUser(user))));
    }

}
