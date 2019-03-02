import { Injectable } from '@angular/core';
import { EmailModel } from '../email/email.model';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UsercpEmailService implements Resolve<EmailModel> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<EmailModel> {
        return this._httpService.get('usercp/email')
            .pipe(map(res => new EmailModel(res)));
    }
}
