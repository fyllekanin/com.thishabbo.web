import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NameSettings } from '../name-settings/name-settings.model';

@Injectable()
export class NameSettingsService implements Resolve<NameSettings> {
    constructor(private _httpService: HttpService) {}

    resolve(): Observable<NameSettings> {
        return this._httpService
            .get('usercp/name-settings')
            .pipe(map(res => new NameSettings(res)));
    }

    save(colors: Array<string>): Observable<NameSettings> {
        return this._httpService.put('usercp/name-settings', {
            colors: colors
        });
    }
}
