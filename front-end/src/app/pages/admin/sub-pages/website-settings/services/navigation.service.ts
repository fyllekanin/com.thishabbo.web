import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { MainItem } from 'shared/app-views/navigation/navigation.model';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NavigationService implements Resolve<Array<MainItem>> {

    constructor(private _httpService: HttpService) {}

    resolve(): Observable<Array<MainItem>> {
        return this._httpService.get('admin/content/navigation')
            .pipe(map(res => res.map(item => new MainItem(item))));
    }
}
