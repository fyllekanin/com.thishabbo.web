import { Prefix } from '../prefixes/prefix.model';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class PrefixService implements Resolve<Prefix> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Prefix> {
        const prefixId = route.params['prefixId'];
        return this._httpService.get(`admin/prefixes/${prefixId}`)
            .pipe(map(data => new Prefix(data)));
    }
}
