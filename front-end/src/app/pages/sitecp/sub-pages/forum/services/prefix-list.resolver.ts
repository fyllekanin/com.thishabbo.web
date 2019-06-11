import { Prefix } from '../prefixes/prefix.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class PrefixListResolver implements Resolve<Array<Prefix>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<Prefix>> {
        return this._httpService.get(`sitecp/prefixes`)
            .pipe(map(data => {
                return data.map(res => new Prefix(res));
            }));
    }
}
