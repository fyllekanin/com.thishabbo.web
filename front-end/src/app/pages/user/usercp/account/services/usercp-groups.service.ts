import { catchError, map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserCpGroup, UserCpGroupsPage } from '../groups/usercp-groups.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class UsercpGroupsService implements Resolve<UserCpGroupsPage> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {
    }

    resolve(): Observable<UserCpGroupsPage> {
        return this._httpService.get('usercp/groups').pipe(map(res => new UserCpGroupsPage(res)));
    }

    apply(groupId: number): Observable<void> {
        return this._httpService.post('usercp/groups/apply', { groupId: groupId })
            .pipe(catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }

    leave(groupId: number): Observable<void> {
        return this._httpService.delete(`usercp/groups/${groupId}`)
            .pipe(catchError(this._globalNotificationService.failureNotification.bind(this._globalNotificationService)));
    }

    updateDisplayGroup(group: UserCpGroup): void {
        this._httpService.put('usercp/groups/displaygroup', { groupId: group.groupId })
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Display group updated'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }
}
