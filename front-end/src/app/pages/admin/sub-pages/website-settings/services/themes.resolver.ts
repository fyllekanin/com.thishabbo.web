import { Injectable } from '@angular/core';
import { Theme } from '../themes/theme.model';
import { HttpService } from 'core/services/http/http.service';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ThemesResolver implements Resolve<Array<Theme>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<Theme>> {
        return this._httpService.get('admin/content/themes')
            .pipe(map(res => res.map(item => new Theme(item))));
    }
}
