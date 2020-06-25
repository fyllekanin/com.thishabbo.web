import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DjSaysModel } from '../dj-says/dj-says.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DjSaysResolver implements Resolve<DjSaysModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<DjSaysModel> {
        return this._httpService.get('staff/radio/dj-says')
            .pipe(map(res => new DjSaysModel(res)));
    }
}
