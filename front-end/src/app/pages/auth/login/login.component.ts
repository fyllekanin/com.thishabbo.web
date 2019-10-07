import { Breadcrumb } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { Page } from 'shared/page/page.model';
import { AuthService } from 'core/services/auth/auth.service';
import { Component, ElementRef, OnDestroy } from '@angular/core';
import { TitleTab } from 'shared/app-views/title/title.model';
import { LoginAction } from './login.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth-login',
    templateUrl: 'login.component.html',
    styleUrls: [ 'login.component.css' ]
})

export class LoginComponent extends Page implements OnDestroy {
    private haveTriedAuthentication = false;
    loginName = '';
    password = '';

    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Login', value: LoginAction.LOGIN }),
        new TitleTab({ title: 'Register', value: LoginAction.REGISTER }),
        new TitleTab({ title: 'Forgotten Password', value: LoginAction.FORGOTTEN_PASSWORD })
    ];

    constructor (
        private _authService: AuthService,
        private _router: Router,
        breadcrumbService: BreadcrumbService,
        elementRef: ElementRef
    ) {
        super(elementRef);
        breadcrumbService.breadcrumb = new Breadcrumb({ current: 'Login' });
    }

    ngOnDestroy (): void {
        super.destroy();
    }

    onAction (action: number) {
        switch (action) {
            case LoginAction.LOGIN:
                this.doLogin();
                break;
            case LoginAction.REGISTER:
                this._router.navigateByUrl('auth/register');
                break;
            case LoginAction.FORGOTTEN_PASSWORD:
                this._router.navigateByUrl('auth/forgot-password');
                break;
        }
    }

    doLogin (): void {
        this._authService.login(this.loginName, this.password).add(() => {
            this.haveTriedAuthentication = true;
        });
    }

    get showError (): boolean {
        return !this._authService.isLoggedIn() && this.haveTriedAuthentication;
    }
}
