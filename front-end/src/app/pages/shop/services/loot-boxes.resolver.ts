import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http/http.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LootBoxesPage } from '../loot-boxes/loot-boxes.model';

@Injectable()
export class LootBoxesResolver implements Resolve<LootBoxesPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<LootBoxesPage> {
        const page = activatedRouteSnapshot.params['page'];
        return this._httpService.get(`shop/loot-boxes/page/${page}`)
            .pipe(map(res => new LootBoxesPage(res)));
    }
}
