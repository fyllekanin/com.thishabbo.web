import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingLogModel } from './booking-log.model';

@Injectable()
export class BookingLogResolver implements Resolve<BookingLogModel> {

    constructor(private _httpService: HttpService) {}

    resolve(activatedRoute: ActivatedRouteSnapshot): Observable<BookingLogModel> {
        const type = activatedRoute.data['type'];
        const page = activatedRoute.params['page'];
        return this._httpService.get(`staff/${type}/booking/page/${page}`)
            .pipe(map(res => new BookingLogModel(res)));
    }
}
