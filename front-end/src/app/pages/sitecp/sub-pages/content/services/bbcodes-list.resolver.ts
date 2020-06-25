import { BBcodeModel } from '../bbcodes/bbcode.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';

@Injectable()
export class BBcodesListResolver implements Resolve<Array<BBcodeModel>> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<Array<BBcodeModel>> {
        return this._httpService.get('sitecp/content/bbcodes')
            .pipe(map(notices => notices.map(notice => new BBcodeModel(notice))));
    }
}
