import { Injectable } from '@angular/core';
import { PageModel } from '../pages/page.model';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PagesResolver implements Resolve<Array<PageModel>> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<Array<PageModel>> {
        return this._httpService.get('sitecp/content/pages')
            .pipe(map(res => res.map(item => new PageModel(item))));
    }
}
