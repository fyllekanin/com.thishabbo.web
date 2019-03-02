import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouletteModel } from '../roulette/roulette.model';

@Injectable()
export class RouletteResolver implements Resolve<RouletteModel> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<RouletteModel> {
        return this._httpService.get(`betting/roulette`)
            .pipe(map(res => new RouletteModel(res)));
    }
}
