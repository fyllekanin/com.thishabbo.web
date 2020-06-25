import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class HabboService implements Resolve<string> {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve (): Observable<string> {
        return this._httpService.get('usercp/habbo')
            .pipe(map(res => res.habbo));
    }

    save (habbo: string): Observable<void> {
        return this._httpService.put('usercp/habbo', { habbo: habbo })
            .pipe(catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }
}
