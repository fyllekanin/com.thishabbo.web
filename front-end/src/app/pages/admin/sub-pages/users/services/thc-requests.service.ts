import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { ThcRequestModel } from '../thc-requests/thc-requests.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';

@Injectable()
export class ThcRequestsService implements Resolve<Array<ThcRequestModel>> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {}

    resolve(): Observable<Array<ThcRequestModel>> {
        return this._httpService.get(`admin/thc/requests`)
            .pipe(map(res => {
                return res.map(item => new ThcRequestModel(item));
            }));
    }

    updateRequests(requests: Array<{ requestThcId: number, isApproved: boolean }>): Observable<void> {
        return this._httpService.put('admin/thc/requests', { requests: requests })
            .pipe(catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }
}
