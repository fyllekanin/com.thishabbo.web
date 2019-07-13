import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { VersionsPage } from '../versions/versions.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class VersionsResolver implements Resolve<VersionsPage> {

    constructor(private _httpService: HttpService) {}

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<VersionsPage> {
        const page = activatedRouteSnapshot.params['page'];
        return this._httpService.get(`page/versions/page/${page}`)
            .pipe(map(res => new VersionsPage(res)));
    }
}
