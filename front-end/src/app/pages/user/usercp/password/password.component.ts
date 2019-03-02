import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../usercp.constants';

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
        private _globalNotificationService: GlobalNotificationService,
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
        })
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'You password is now updated'
                }));
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }
}
