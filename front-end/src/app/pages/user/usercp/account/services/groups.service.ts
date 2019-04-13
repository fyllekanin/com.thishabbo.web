import { catchError, map } from 'rxjs/operators';
import { HttpService } from 'core/services/http/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserCpGroup, UserCpGroupsPage } from '../groups/groups.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class GroupsService implements Resolve<UserCpGroupsPage> {

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService
    ) {
    }

    resolve(): Observable<UserCpGroupsPage> {
        return this._httpService.get('usercp/groups').pipe(map(res => new UserCpGroupsPage(res)));
    }

    apply(groupId: number): Observable<void> {
        return this._httpService.post('usercp/groups/apply', { groupId: groupId })
            .pipe(catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    leave(groupId: number): Observable<void> {
        return this._httpService.delete(`usercp/groups/${groupId}`)
            .pipe(catchError(this._notificationService.failureNotification.bind(this._notificationService)));
    }

    updateDisplayGroup(group: UserCpGroup): void {
        this._httpService.put('usercp/groups/displaygroup', { groupId: group.groupId })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'Display group updated'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
