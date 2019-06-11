import { PostModerate } from '../posts/posts-moderation.model';
import { map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class PostsModerationResolver implements Resolve<Array<PostModerate>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<PostModerate>> {
        return this._httpService.get('sitecp/moderation/posts')
            .pipe(map(data => data.map(res => new PostModerate(res))));
    }
}
