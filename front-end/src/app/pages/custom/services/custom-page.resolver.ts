import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PageModel } from '../../sitecp/sub-pages/website-settings/pages/page.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CustomPageResolver implements Resolve<PageModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<PageModel> {
        const page = route.params['page'];
        return this._httpService.get(`page/custom/${page}`)
            .pipe(map(res => new PageModel(res)));
    }
}
