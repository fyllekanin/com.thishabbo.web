import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { BadgeUser, BadgeUsersModel } from './badge-users.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, BADGE_LIST_BREADCRUMB_ITEM } from '../../../admin.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Button } from 'shared/directives/button/button.model';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { ArrayHelper } from 'shared/helpers/array.helper';

@Component({
    selector: 'app-admin-badges-users',
    templateUrl: 'badge-users.component.html'
})
export class BadgeUsersComponent extends Page implements OnDestroy {
    private _data: BadgeUsersModel;

    nickname: string;
    addButton = Button.GREEN;
    userTabs: Array<TitleTab> = [
        new TitleTab({ title: 'Remove' })
    ];

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService,
        elementRef: ElementRef,
        activatedRoute: ActivatedRoute,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Manage badge users',
            items: [
                SITECP_BREADCRUMB_ITEM,
                BADGE_LIST_BREADCRUMB_ITEM
            ]
        });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    save(): void {
        const userIds = this._data.users.map(user => user.userId);
        this._httpService.put(`admin/badges/${this._data.badge.badgeId}/users`, { userIds: userIds })
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Users with this badge are now updated!'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    removeUser(user: BadgeUser): void {
        this._data.users = this._data.users.filter(item => item.userId !== user.userId);
        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
            title: 'Removed',
            message: 'User is removed'
        }));
        this.save();
    }

    addUser(): void {
        const user = this._data.availableUsers
            .find(item => item.nickname.toLowerCase() === this.nickname.toLowerCase());
        if (!user) {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                message: `User with name "${this.nickname}" do not exist`,
                title: 'User do not exist',
                type: NotificationType.ERROR
            }));
            return;
        }

        this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
            title: 'Added',
            message: 'User is added'
        }));
        this.nickname = '';
        this._data.users.push(user);
        this.save();
    }

    get users(): Array<BadgeUser> {
        return this._data.users.sort(ArrayHelper.sortByPropertyDesc.bind(this, 'nickname'));
    }

    get title(): string {
        return `Manage users for badge: ${this._data.badge.name}`;
    }

    private onData(data: { data: BadgeUsersModel }): void {
        this._data = data.data;
    }
}
