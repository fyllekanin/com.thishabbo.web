import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';

@Injectable()
export class HabboService implements Resolve<string> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {
    }

    resolve(): Observable<string> {
        return this._httpService.get('usercp/habbo')
            .pipe(map(res => res.habbo));
    }

    save(habbo: string): Observable<void> {
        return this._httpService.put('usercp/habbo', { habbo: habbo })
            .pipe(catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }
}
