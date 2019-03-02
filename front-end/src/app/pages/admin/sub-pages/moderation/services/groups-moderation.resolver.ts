import { GroupModerate } from '../groups/groups-moderation.model';
import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class GroupsModerationResolver implements Resolve<Array<GroupModerate>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<GroupModerate>> {
        return this._httpService.get('admin/moderation/groups')
            .pipe(map(data => data.map(res => new GroupModerate(res))));
    }
}
