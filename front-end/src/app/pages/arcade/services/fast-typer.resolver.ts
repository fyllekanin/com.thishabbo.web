import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HighScoreModel } from '../arcade.model';

@Injectable()
export class FastTyperResolver implements Resolve<Array<HighScoreModel>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<HighScoreModel>> {
        return this._httpService.get('arcade/fast-typer/highscore')
            .pipe(map(res => res.map(item => new HighScoreModel(item))));
    }
}
