import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'shared/page/page.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth-forgot-password',
    templateUrl: 'forgot-password.component.html'
})
export class ForgotPasswordComponent extends Page implements OnDestroy {
    habbo: string;

    constructor (
        private _httpService: HttpService,
        private _notificationService: NotificationService,
        private _router: Router,
        elementRef: ElementRef,
        breadcrumbService: BreadcrumbService
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({
            current: 'Forgot Password'
        });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onClick (): void {
        this._httpService.get(`auth/forgot-password/code/${this.habbo}`)
            .subscribe((item: { userId: number, code: string }) => {
                this._router.navigateByUrl(`/auth/change-password/${item.userId}/${item.code}`);
            }, this._notificationService.failureNotification.bind(this._notificationService));
    }
}
