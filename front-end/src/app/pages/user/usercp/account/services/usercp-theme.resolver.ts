import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ThemeModel } from '../theme/theme.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UsercpThemeResolver implements Resolve<Array<ThemeModel>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<ThemeModel>> {
        return this._httpService.get('usercp/themes')
            .pipe(map(res => res.map(item => new ThemeModel(item))));
    }
}
