import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { ThreadModerate } from '../threads/threads-moderation.model';

@Injectable()
export class ThreadsModerationResolver implements Resolve<Array<ThreadModerate>> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<Array<ThreadModerate>> {
        return this._httpService.get('sitecp/moderation/threads')
            .pipe(map(data => data.map(res => new ThreadModerate(res))));
    }
}
