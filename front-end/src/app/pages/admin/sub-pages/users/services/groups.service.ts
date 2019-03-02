import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http/http.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { GroupsModel } from '../groups/groups.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Injectable()
export class GroupsService implements Resolve<GroupsModel> {

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<GroupsModel> {
        const userId = route.params['userId'];
        return this._httpService.get(`admin/users/${userId}/groups`)
            .pipe(map(res => new GroupsModel(res)));
    }

    updateUsersGroups(groupIds: Array<number>, displayGroupId: number, userId: string): void {
        const body = {
            groupIds: groupIds,
            displayGroupId: displayGroupId
        };
        this._httpService.put(`admin/users/${userId}/groups`, body)
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'User groups are updated!'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }
}
