import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MaintenanceModel } from '../maintenance/maintenance.model';

@Injectable()
export class MaintenanceResolver implements Resolve<MaintenanceModel> {

    constructor (private _httpService: HttpService) {
    }

    resolve (): Observable<MaintenanceModel> {
        return this._httpService.get('sitecp/content/maintenance')
            .pipe(map(res => new MaintenanceModel(res)));
    }
}
