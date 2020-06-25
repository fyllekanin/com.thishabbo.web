import { Injectable } from '@angular/core';
import { Ban, BanModel } from '../ban/ban.model';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IReason } from 'shared/components/reason/reason.model';

@Injectable()
export class BanService implements Resolve<BanModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (activatedRoute: ActivatedRouteSnapshot): Observable<BanModel> {
        const userId = activatedRoute.params['userId'];
        return this._httpService.get(`sitecp/users/${userId}/bans`)
            .pipe(map(res => new BanModel(res)));
    }

    liftBan (userId: number, banId: number, reason: IReason): Observable<Ban> {
        return this._httpService.put(`sitecp/users/${userId}/lift/${banId}`, { reason: reason });
    }

    banUser (userId: number, reason: IReason): Observable<Ban> {
        return this._httpService.post(`sitecp/users/${userId}/ban`, { reason: reason });
    }
}
