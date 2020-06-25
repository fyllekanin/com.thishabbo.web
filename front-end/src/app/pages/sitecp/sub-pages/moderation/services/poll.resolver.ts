import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PollModel } from '../polls/poll/poll.model';

@Injectable()
export class PollResolver implements Resolve<PollModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<PollModel> {
        const threadId = route.params['threadId'];

        return this._httpService.get(`sitecp/moderation/polls/${threadId}`)
            .pipe(map(res => new PollModel(res)));
    }
}
