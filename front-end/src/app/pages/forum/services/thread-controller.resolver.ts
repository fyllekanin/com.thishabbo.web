import { ThreadSkeleton } from '../category/thread-controller/thread-controller.model';
import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class ThreadControllerResolver implements Resolve<ThreadSkeleton> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ThreadSkeleton> {
        const categoryId = route.params['categoryId'];
        const threadId = route.params['threadId'] || 'new';
        return this._httpService.get(`forum/category/${categoryId}/thread/${threadId}`)
            .pipe(map(res => new ThreadSkeleton(res)));
    }
}
