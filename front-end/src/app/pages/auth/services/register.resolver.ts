import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterPage } from '../register/register.model';

@Injectable()
export class RegisterResolver implements Resolve<RegisterPage> {

    constructor(private _httpService: HttpService) {
    }

    resolve(): Observable<RegisterPage> {
        return this._httpService.get('auth/register').pipe(map(res => new RegisterPage(res)));
    }
}
