import { Observable, of } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { BBcodeModel } from '../bbcodes/bbcode.model';
import { map } from 'rxjs/operators';

@Injectable()
export class BBcodeResolver implements Resolve<BBcodeModel> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<BBcodeModel> {
        const bbcodeId = route.params['bbcodeId'];

        if (bbcodeId === 'new') {
            return of(new BBcodeModel());
        }

        return this._httpService.get(`admin/content/bbcodes/${bbcodeId}`)
            .pipe(map(res => new BBcodeModel(res)));
    }
}
