import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { BadgeUser, BadgeUsersModel } from './badge-users.model';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { SITECP_BREADCRUMB_ITEM, BADGE_LIST_BREADCRUMB_ITEM } from '../../../admin.constants';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Button } from 'shared/directives/button/button.model';
import { NotificationModel, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
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
        private _notificationService: NotificationService,
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
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'Users with this badge are now updated!'
                }));
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    removeUser(user: BadgeUser): void {
        this._data.users = this._data.users.filter(item => item.userId !== user.userId);
        this._notificationService.sendNotification(new NotificationModel({
            title: 'Removed',
            message: 'User is removed'
        }));
        this.save();
    }

    addUser(): void {
        const user = this._data.availableUsers
            .find(item => item.nickname.toLowerCase() === this.nickname.toLowerCase());
        if (!user) {
            this._notificationService.sendNotification(new NotificationModel({
                message: `User with name "${this.nickname}" do not exist`,
                title: 'User do not exist',
                type: NotificationType.ERROR
            }));
            return;
        }

        this._notificationService.sendNotification(new NotificationModel({
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
