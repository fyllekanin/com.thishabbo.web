import { PrefixListPage } from '../prefixes/prefix.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class PrefixListResolver implements Resolve<PrefixListPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<PrefixListPage> {
        const page = activatedRouteSnapshot.params['page'];
        return this._httpService.get(`sitecp/prefixes/page/${page}`)
            .pipe(map(res => new PrefixListPage(res)));
    }
}
