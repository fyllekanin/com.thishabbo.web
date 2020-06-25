import { catchError, map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Signature } from '../signature/signature.model';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class SignatureService implements Resolve<Signature> {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve (): Observable<Signature> {
        return this._httpService.get('usercp/signature')
            .pipe(map((res => new Signature(res))));
    }

    save (signature: string): Observable<Signature> {
        return this._httpService.put('usercp/signature', { signature: signature })
            .pipe(catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    parse (signature: string): Observable<string> {
        return this._httpService.post('bbcode/parse', { content: signature });
    }
}
