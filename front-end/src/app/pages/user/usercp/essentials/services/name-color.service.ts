
import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NameColor } from '../name-color/name-color.model';

@Injectable()
export class NameColorService implements Resolve<NameColor> {

    constructor(
        private _httpService: HttpService
    ) {
    }

    resolve(): Observable<NameColor> {
        return this._httpService.get('usercp/name-color')
            .pipe(map(res => new NameColor(res)));
    }

    save(colors: Array<string>): Observable<NameColor> {
        return this._httpService.put('usercp/name-color', { colors: colors });
    }
}
