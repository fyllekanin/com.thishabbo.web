import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { AuthService } from 'core/services/auth/auth.service';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Button } from 'shared/directives/button/button.model';

@Component({
    selector: 'app-auth-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})

export class LoginComponent extends Page implements OnDestroy {
    private haveTriedAuthentication = false;

    registerButton = Button.GREEN;
    loginName = '';
    password = '';

    constructor(
        private _authService: AuthService,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'Login' });
    }

    ngOnDestroy(): void {
        super.destroy();
    }

    keyDownFunction(event): void {
        if (event.keyCode === 13) {
            this.doLogin();
        }
    }

    doLogin(): void {
        this._authService.login(this.loginName, this.password).add(() => {
            this.haveTriedAuthentication = true;
        });
    }

    get showError(): boolean {
        return !this._authService.isLoggedIn() && this.haveTriedAuthentication;
    }
}
