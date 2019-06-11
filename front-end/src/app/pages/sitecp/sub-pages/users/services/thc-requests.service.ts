import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { ThcRequestModel } from '../thc-requests/thc-requests.model';
import { NotificationService } from 'core/services/notification/notification.service';

@Injectable()
export class ThcRequestsService implements Resolve<Array<ThcRequestModel>> {

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {}

    resolve(): Observable<Array<ThcRequestModel>> {
        return this._httpService.get(`sitecp/thc/requests`)
            .pipe(map(res => {
                return res.map(item => new ThcRequestModel(item));
            }));
    }

    updateRequests(requests: Array<{ requestThcId: number, isApproved: boolean }>): Observable<void> {
        return this._httpService.put('sitecp/thc/requests', { requests: requests })
            .pipe(catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }
}
