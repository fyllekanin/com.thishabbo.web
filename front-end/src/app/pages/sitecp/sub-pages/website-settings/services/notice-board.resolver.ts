import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Notice } from 'shared/components/notice/notice.model';
import { HttpService } from 'core/services/http/http.service';

@Injectable()
export class NoticeBoardResolver implements Resolve<Array<Notice>> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<Array<Notice>> {
        return this._httpService.get('sitecp/content/notices')
            .pipe(map(notices => notices.map(notice => new Notice(notice))));
    }
}
