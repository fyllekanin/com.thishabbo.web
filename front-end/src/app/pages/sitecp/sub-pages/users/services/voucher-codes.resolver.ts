import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { VoucherCodesPage } from '../voucher-codes/voucher-codes.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class VoucherCodesResolver implements Resolve<VoucherCodesPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<VoucherCodesPage> {
        const page = route.params['page'];
        return this._httpService.get(`sitecp/voucher-codes/page/${page}`)
            .pipe(map(res => new VoucherCodesPage(res)));
    }
}
