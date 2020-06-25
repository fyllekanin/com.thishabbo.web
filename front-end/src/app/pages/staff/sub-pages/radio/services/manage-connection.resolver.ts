import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManageConnectionModel } from '../manage-connection/manage-connection.model';

@Injectable()
export class ManageConnectionResolver implements Resolve<ManageConnectionModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<ManageConnectionModel> {
        return this._httpService.get('staff/radio/manage-connection')
            .pipe(map(res => new ManageConnectionModel(res)));
    }
}
