import { catchError, map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Signature } from '../signature/signature.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';

@Injectable()
export class SignatureService implements Resolve<Signature> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {
    }

    resolve(): Observable<Signature> {
        return this._httpService.get('usercp/signature')
            .pipe(map((res => new Signature(res))));
    }

    save(signature: string): Observable<Signature> {
        return this._httpService.put('usercp/signature', { signature: signature })
            .pipe(catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));

    }
}
