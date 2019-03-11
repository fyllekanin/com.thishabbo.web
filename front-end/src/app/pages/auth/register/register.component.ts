import { Component, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { Page } from 'shared/page/page.model';
import { RegisterModel, RegisterPage } from './register.model';
import { Button } from 'shared/directives/button/button.model';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { GlobalNotification, NotificationType } from 'shared/app-views/global-notification/global-notification.model';
import { AuthService } from 'core/services/auth/auth.service';

@Component({
    selector: 'app-auth-register',
    templateUrl: 'register.component.html'
})

export class RegisterComponent extends Page implements OnDestroy {
    private _data: RegisterPage;
    registerModel: RegisterModel = new RegisterModel();

    registerButton = Button.GREEN;

    constructor(
        private _globalNotificationService: GlobalNotificationService,
        private _httpService: HttpService,
        private _authService: AuthService,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'Register' });
        this.addSubscription(activatedRoute.data, this.onData.bind(this));
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    register(): void {
        if (!this.isUserValid()) {
            return;
        }
        this._httpService.post('auth/register', { data: this.registerModel }).subscribe(() => {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Success',
                message: 'You are now registered!'
            }));
            this._authService.login(this.registerModel.username, this.registerModel.password);
        }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    private isUserValid(): boolean {
        if (this.isNicknameTaken()) {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Error',
                message: 'nickname is already taken',
                type: NotificationType.ERROR
            }));
            return false;
        }
        if (!this.isReferredByValid()) {
            this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                title: 'Error - Referred',
                message: 'There is no user with that name',
                type: NotificationType.ERROR
            }));
            return false;
        }
        return true;
    }

    private isNicknameTaken(): boolean {
        if (!this.registerModel.nickname) {
            return true;
        }
        return this._data.nicknames
            .findIndex(item => item.toLowerCase() === this.registerModel.nickname.toLowerCase()) > -1;
    }

    private isReferredByValid(): boolean {
        if (!this.registerModel.referredBy) {
            return true;
        }
        return this._data.nicknames
            .some(item => item.toLowerCase() === this.registerModel.referredBy.toLowerCase());
    }

    private onData(data: { data: RegisterPage }): void {
        this._data = data.data;
    }
}
