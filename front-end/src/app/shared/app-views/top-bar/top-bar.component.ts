import { AuthService } from 'core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { Breadcrumb, BreadcrumbItem } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Component } from '@angular/core';
import { NotificationModel } from 'shared/app-views/top-bar/top-bar.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { RouterStateService } from 'core/services/router/router-state.service';
import { ArrayHelper } from 'shared/helpers/array.helper';

@Component({
    selector: 'app-top-bar',
    templateUrl: 'top-bar.component.html',
    styleUrls: ['top-bar.component.css']
})

export class TopBarComponent {
    private _notifications: Array<NotificationModel<any>> = [];
    private _breadcrumb: Breadcrumb;

    loginName = '';
    password = '';

    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _httpService: HttpService,
        private _routerStateService: RouterStateService,
        private _continuesInformationService: ContinuesInformationService,
        breadcrumbService: BreadcrumbService
    ) {
        breadcrumbService.onBreadcrumb.subscribe(breadcrum => {
            this._breadcrumb = breadcrum;
        });
        this._continuesInformationService.onNotifications.subscribe(this.onNotifications.bind(this));
    }

    login(): void {
        this._authService.login(this.loginName, this.password, () => {
            this._router.navigateByUrl('/auth/login');
        });
        this.loginName = '';
        this.password = '';
    }

    keyDownFunction(event): void {
        if (event.keyCode === 13) {
            this.login();
        }
    }

    notificationClick(notificationId: number): void {
        this._httpService.put(`puller/notifications/read/${notificationId}`)
            .subscribe(() => {
                this._continuesInformationService.removeNotification(notificationId);
                this._notifications = this._notifications.filter(noti => noti.notificationId !== notificationId);
                this._routerStateService.updateTitle(this._notifications.length);
            });
    }

    get homePage(): Array<string> {
        const homePage = this._authService.isLoggedIn() && this._authService.authUser.homePage ?
            this._authService.authUser.homePage : '/home';
        return [homePage];
    }

    get loggedIn(): boolean {
        return this._authService.isLoggedIn();
    }

    get notifications(): Array<NotificationModel<any>> {
        return this._notifications;
    }

    get breadcrumbItems(): Array<BreadcrumbItem> {
        return this._breadcrumb ? this._breadcrumb.items : [];
    }

    get current(): string {
        return this._breadcrumb ? this._breadcrumb.current : '';
    }

    private onNotifications(notifications: Array<NotificationModel<any>>): void {
        this._notifications = notifications;
        this._notifications.sort(ArrayHelper.sortByPropertyAsc.bind(this, 'createdAt'));
        this._routerStateService.updateTitle(this._notifications.length);
    }
}
