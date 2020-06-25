import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable, of } from 'rxjs';
import { AutoBan } from '../auto-bans/auto-ban.model';
import { map } from 'rxjs/operators';

@Injectable()
export class AutoBanService implements Resolve<AutoBan> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<AutoBan> {
        const autoBanId = route.params['autoBanId'];

        return autoBanId === 'new' ? of(new AutoBan()) : this._httpService.get(`sitecp/moderation/auto-bans/${autoBanId}`)
            .pipe(map(res => new AutoBan(res)));
    }
}
