import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Theme } from '../themes/theme.model';

@Injectable()
export class ThemeResolver implements Resolve<Theme> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<Theme> {
        const themeId = route.params['themeId'];

        return themeId === 'new' ? of(new Theme()) : this._httpService.get(`sitecp/content/themes/${themeId}`)
            .pipe(map(res => new Theme(res)));
    }
}
