import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyBetsModel } from '../my-bets/my-bets.model';

@Injectable()
export class MyBetsResolver implements Resolve<MyBetsModel> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<MyBetsModel> {
        return this._httpService.get(`betting/bets/active`)
            .pipe(map(res => new MyBetsModel(res)));
    }
}
