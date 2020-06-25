import { Injectable } from '@angular/core';
import { SiteMessageModel } from '../site-messages/site-message.model';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SiteMessagesResolver implements Resolve<Array<SiteMessageModel>> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<Array<SiteMessageModel>> {
        return this._httpService.get('sitecp/content/site-messages')
            .pipe(map(res => {
                return res.map(item => new SiteMessageModel(item));
            }));
    }
}
