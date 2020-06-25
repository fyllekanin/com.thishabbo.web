import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { LatestPostsPage } from '../latest-posts/latest-posts.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LatestPostsResolver implements Resolve<LatestPostsPage> {

    constructor (private _httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<LatestPostsPage> {
        const page = route.params['page'];

        return this._httpService.get(`page/forum/latest-posts/page/${page}`)
            .pipe(map(res => new LatestPostsPage(res)));
    }
}
