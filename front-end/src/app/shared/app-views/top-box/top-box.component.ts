import { AuthService } from 'core/services/auth/auth.service';
import { Component } from '@angular/core';
import { AuthUser } from 'core/services/auth/auth.model';
import { MainItem } from 'shared/app-views/navigation/navigation.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { Router } from '@angular/router';

@Component({
    selector: 'app-top-box',
    templateUrl: 'top-box.component.html',
    styleUrls: ['top-box.component.css']
})
export class TopBoxComponent {
    private _user: AuthUser;
    private _navigation: Array<MainItem> = [];

    isFixed: boolean;
    showMenu: boolean;

    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
        this.setUser();
        const navigation = localStorage.getItem(LOCAL_STORAGE.NAVIGATION);
        this._navigation = (navigation ? JSON.parse(localStorage.getItem(LOCAL_STORAGE.NAVIGATION)) : [])
            .map(item => new MainItem(item));
        this._authService.onUserChange.subscribe(this.setUser.bind(this));
        this.isFixed = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
    }

    logout(): void {
        this._authService.logout(false);
    }

    goToProfile(): void {
        this._router.navigateByUrl(`/user/profile/${this._authService.authUser.nickname}`);
    }

    get credits(): number {
        return this._authService.authUser.credits;
    }

    get menuClasses(): string {
        const classes = [];
        if (this.showMenu) {
            classes.push('menu-show');
        }
        if (this.isFixed) {
            classes.push('fixed-menu-margin');
        }
        return classes.join(' ');
    }

    get routes(): Array<MainItem> {
        return this._navigation
            .filter(item => item.loginRequired ? this._authService.isLoggedIn() : true);
    }

    get avatar(): string {
        return `/rest/resources/images/users/${this._authService.authUser.userId}.gif?${this._authService.authUser.avatarUpdatedAt}`;
    }

    get username(): string {
        return this._authService.authUser.nickname;
    }

    get isLoggedIn(): boolean {
        return Boolean(this._user);
    }

    get nickname(): string {
        return this._user ? this._user.nickname : 'User';
    }

    get isAdmin(): boolean {
        return this._user && this._user.isAdmin;
    }

    get isStaff(): boolean {
        return this._user && this._user.isStaff;
    }

    private setUser(): void {
        this._user = this._authService.isLoggedIn() ? this._authService.authUser : null;
    }
}
