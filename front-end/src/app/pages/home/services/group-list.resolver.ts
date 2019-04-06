import { Injectable } from '@angular/core';
import { GroupList } from '../group-list/group-list.model';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GroupListResolver implements Resolve<Array<GroupList>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<GroupList>> {
        return this._httpService.get('group-list')
            .pipe(map(res => res.map(item => new GroupList(item))));
    }
}
