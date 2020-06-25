import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationsPage } from '../notifications/notifications.model';

@Injectable()
export class NotificationsService implements Resolve<NotificationsPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<NotificationsPage> {
        const page = route.params['page'];
        return this._httpService.get(`usercp/notifications/page/${page}`)
            .pipe(map(res => new NotificationsPage(res)));
    }
}
