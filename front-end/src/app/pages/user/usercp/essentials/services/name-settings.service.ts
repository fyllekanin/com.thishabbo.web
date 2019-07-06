import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NameColor } from '../name-settings/name-settings.model';

@Injectable()
export class NameSettingsService implements Resolve<NameColor> {
    constructor(private _httpService: HttpService) {}

    resolve(): Observable<NameColor> {
        return this._httpService
            .get('usercp/name-settings')
            .pipe(map(res => new NameColor(res)));
    }

    save(colors: Array<string>): Observable<NameColor> {
        return this._httpService.put('usercp/name-settings', {
            colors: colors
        });
    }
}
