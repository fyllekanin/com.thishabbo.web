import { catchError, map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Signature } from '../signature/signature.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { NameColour } from '../name-colour/name-colour.model';

@Injectable()
export class NameColourService implements Resolve<NameColour> {

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve(): Observable<NameColour> {
        return this._httpService.get('usercp/name-colour')
            .pipe(map((res => new NameColour(res))));
    }

    save(colours: Array<string>): Observable<NameColour> {
        return this._httpService.put('usercp/name-colour', { colours: colours })
            .pipe(catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }
}
