
import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NameColour } from '../name-colour/name-colour.model';

@Injectable()
export class NameColourService implements Resolve<NameColour> {

    constructor(
        private _httpService: HttpService
    ) {
    }

    resolve(): Observable<NameColour> {
        return this._httpService.get('usercp/name-colour')
            .pipe(map(res => new NameColour(res)));
    }

    save(colours: Array<string>): Observable<NameColour> {
        return this._httpService.put('usercp/name-colour', { colours: colours });
    }
}
