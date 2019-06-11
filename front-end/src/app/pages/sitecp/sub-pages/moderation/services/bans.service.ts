import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { BansPage } from '../bans/bans.model';
import { QueryParameters } from 'core/services/http/http.model';
import { IReason } from 'shared/components/reason/reason.model';
import { Ban } from '../../users/ban/ban.model';

@Injectable()
export class BansPageService implements Resolve<BansPage> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<BansPage> {
        const pageNr = route.params['page'];
        const filter = route.queryParams;
        return this.getBans(filter, pageNr);
    }

    getBans(filter: QueryParameters, page: number) {
        return this._httpService.get(`sitecp/moderation/bans/page/${page}`, filter)
            .pipe(map(res => new BansPage(res)));
    }

    liftBan(userId: number, banId: number, reason: IReason): Observable<Ban> {
        return this._httpService.put(`sitecp/users/${userId}/lift/${banId}`, { reason: reason });
    }
}
