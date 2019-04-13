import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage } from 'shared/app-views/global-notification/global-notification.model';
import { TitleTab } from 'shared/app-views/title/title.model';
import { Page } from 'shared/page/page.model';
import { USERCP_BREADCRUM_ITEM } from '../../usercp.constants';
import { AuthService } from 'core/services/auth/auth.service';

@Component({
    selector: 'app-usercp-home-page',
    templateUrl: 'home-page.component.html'
})
export class HomePageComponent extends Page implements OnDestroy {

    homePage: string;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Save' })
    ];

    constructor (
        private _authService: AuthService,
        private _notificationService: NotificationService,
        private _httpService: HttpService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        this.homePage = this._authService.authUser.homePage;
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Home Page',
            items: [
                USERCP_BREADCRUM_ITEM
            ]
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    update (): void {
        this._httpService.put('usercp/homepage', { homePage: this.homePage })
            .subscribe(() => {
                this._notificationService.sendNotification(new NotificationMessage({
                    title: 'Success',
                    message: 'You home page is now updated'
                }));
                this._authService.authUser.homePage = this.homePage;
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
