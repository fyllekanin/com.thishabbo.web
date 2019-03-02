import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { ListUser, UsersListPage } from '../list/users-list.model';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { DialogService } from 'core/services/dialog/dialog.service';
import { QueryParameters } from 'core/services/http/http.model';

@Injectable()
export class UsersListService implements Resolve<UsersListPage> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<UsersListPage> {
        const pageNr = route.params['page'];
        const filterQuery = route.queryParams['filter'];

        return this._httpService.get(`admin/users/list/page/${pageNr}`, { filter: filterQuery })
            .pipe(map(res => new UsersListPage(res)));
    }

    updateUsersThc(user: ListUser, dialogService: DialogService, credits: number): void {
        this._httpService.put(`admin/users/${user.userId}/thc`, { credits: credits })
            .subscribe(() => {
                user.credits = credits;
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: `${user.nickname} thc updated to ${credits}`
                }));
                dialogService.closeDialog();
                user.credits = credits;
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    getUsers(filter: QueryParameters): Observable<{ data: UsersListPage }> {
        return this._httpService.get(`admin/users/list/page/1`, filter)
            .pipe(map(data => {
                const page = new UsersListPage(data);
                return { data: page };
            }));
    }

    mergeUsers(srcNickname: string, destNickname: string): Observable<void> {
        return this._httpService.post(`admin/users/merge/source/${srcNickname}/destination/${destNickname}`, {})
            .pipe(map(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Users merged!'
                }));
            }), catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }
}
