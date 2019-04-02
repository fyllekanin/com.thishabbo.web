import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'core/services/http/http.service';
import { GlobalNotificationService } from 'core/services/notification/global-notification.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { GlobalNotification } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-auth-change-password',
    templateUrl: 'change-password.component.html'
})
export class ChangePasswordComponent extends Page implements OnDestroy {
    private _code: string;
    private _userId: number;

    password: string;
    repassword: string;

    constructor(
        private _httpService: HttpService,
        private _globalNotificationService: GlobalNotificationService,
        private _router: Router,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService,
        activatedRoute: ActivatedRoute
    ) {
        super(elementRef);
        this._userId = activatedRoute.snapshot.params['userId'];
        this._code = activatedRoute.snapshot.params['code'];
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Change Password'
        });
    }

    ngOnDestroy () {
        super.destroy();
    }

    onClick(): void {
        this._httpService.put(`auth/forgot-password`, {
            userId: this._userId,
            password: this.password,
            repassword: this.repassword
        })
            .subscribe(() => {
                this._globalNotificationService.sendGlobalNotification(new GlobalNotification({
                    title: 'Success',
                    message: 'Your password is changed, you can now login'
                }));
                this._router.navigateByUrl(`/auth/login`);
            }, this._globalNotificationService.failureNotification.bind(this._globalNotificationService));
    }

    get code(): string {
        return this._code;
    }

    get userId(): number {
        return this._userId;
    }
}