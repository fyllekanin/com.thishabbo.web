import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { UsersListPage } from '../list/users-list.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { QueryParameters } from 'core/services/http/http.model';

@Injectable()
export class UsersListService implements Resolve<UsersListPage> {

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<UsersListPage> {
        const pageNr = route.params['page'];
        const filterQuery = route.queryParams['filter'];

        return this._httpService.get(`admin/users/list/page/${pageNr}`, {filter: filterQuery})
            .pipe(map(res => new UsersListPage(res)));
    }

    getUsers (filter: QueryParameters): Observable<{ data: UsersListPage }> {
        return this._httpService.get(`admin/users/list/page/1`, filter)
            .pipe(map(data => {
                const page = new UsersListPage(data);
                return {data: page};
            }));
    }

    mergeUsers (srcNickname: string, destNickname: string): Observable<void> {
        return this._httpService.post(`admin/users/merge/source/${srcNickname}/destination/${destNickname}`, {})
            .pipe(map(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'Users merged!'
                }));
            }), catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }
}
