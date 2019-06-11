import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PostsStatisticsModel } from '../posts-statistics/posts-statistics.model';

@Injectable()
export class PostsStatisticsResolver implements Resolve<PostsStatisticsModel> {

    constructor(private _httpService: HttpService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<PostsStatisticsModel> {
        const year = route.params['year'];
        const month = route.params['month'];
        return this._httpService.get(`sitecp/statistics/posts/${year}/${month}`)
            .pipe(map(res => new PostsStatisticsModel(res)));
    }
}
