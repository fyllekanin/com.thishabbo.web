import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class ServerLogsService implements Resolve<Array<string>> {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve (): Observable<Array<string>> {
        return this._httpService.get('sitecp/server-logs')
            .pipe(map(res => res), catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    getLog (log: string): Observable<string> {
        return this._httpService.get(`sitecp/server-logs/${log}`)
            .pipe(map(res => res), catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }
}
