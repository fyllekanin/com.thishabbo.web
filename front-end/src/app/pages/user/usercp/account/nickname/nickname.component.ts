import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { HttpService } from 'core/services/http/http.service';
import { TitleTab } from 'shared/app-views/title/title.model';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationModel } from 'shared/app-views/global-notification/global-notification.model';
import { AuthService } from 'core/services/auth/auth.service';

@Component({
    selector: 'app-usercp-nickname',
    templateUrl: 'nickname.component.html',
    styleUrls: ['nickname.component.css']
})
export class NicknameComponent extends Page implements OnDestroy {

    nickname: string;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Change Nickname' })
    ];

    constructor(
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _authService: AuthService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Change Nickname',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    onSave(): void {
        this._httpService.put('usercp/nickname', { nickname: this.nickname })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationModel({
                    title: 'Success',
                    message: 'Your nickname is now changed!'
                }));
                this._authService.authUser.nickname = this.nickname;
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }

    ngOnDestroy(): void {
        super.destroy();
    }
}
