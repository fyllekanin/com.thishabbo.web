import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';

@Component({
    selector: 'app-usercp-password',
    templateUrl: 'password.component.html'
})
export class PasswordComponent extends Page implements OnDestroy {

    currentPassword: string;
    password: string;
    repassword: string;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor (
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Password',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    update (): void {
        this._httpService.put('usercp/password', {
            password: this.password,
            repassword: this.repassword,
            currentPassword: this.currentPassword
        }).subscribe(() => {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Success',
                message: 'You password is now updated'
            }));
        }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
