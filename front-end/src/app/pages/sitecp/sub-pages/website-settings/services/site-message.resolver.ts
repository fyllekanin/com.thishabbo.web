import { Injectable } from '@angular/core';
import { SiteMessageModel } from '../site-messages/site-message.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SiteMessageResolver implements Resolve<SiteMessageModel> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<SiteMessageModel> {
        const siteMessageId = route.params['siteMessageId'];
        return siteMessageId === 'new' ? of(new SiteMessageModel()) : this._httpService.get(`sitecp/content/site-messages/${siteMessageId}`)
            .pipe(map(res => new SiteMessageModel(res)));
    }
}
