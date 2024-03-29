import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from 'core/services/auth/auth.model';
import { AuthService } from 'core/services/auth/auth.service';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { MainItem } from 'shared/app-views/navigation/navigation.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { XP_PER_LEVEL } from 'shared/constants/user.constants';

@Component({
    selector: 'app-top-box',
    templateUrl: 'top-box.component.html',
    styleUrls: [ 'top-box.component.css' ]
})
export class TopBoxComponent {
    private _user: AuthUser;
    private _navigation: Array<MainItem> = [];

    menuClasses = '';
    routes: Array<MainItem> = [];
    isFixed: boolean;
    showMenu: boolean;

    constructor (
        private _authService: AuthService,
        private _router: Router,
        continuesInformationService: ContinuesInformationService
    ) {
        this.setUser();
        const navigation = localStorage.getItem(LOCAL_STORAGE.NAVIGATION);
        this._navigation = this.getNavigation(navigation);
        this.routes = this._navigation
            .filter(item => item.loginRequired ? this._user : true);

        this._authService.onUserChange.subscribe(this.setUser.bind(this));
        this.isFixed = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));

        continuesInformationService.onDeviceSettingsUpdated.subscribe(() => {
            this.isFixed = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
            this.updateMenuClasses();
        });
        this.updateMenuClasses();
    }

    logout (): void {
        this._authService.logout(false);
    }

    goToProfile (): void {
        this._router.navigateByUrl(`/user/profile/${this._authService.authUser.nickname}`);
        this.showMenu = false;
        this.updateMenuClasses();
    }

    closeMenu (): void {
        this.showMenu = false;
        this.updateMenuClasses();
        this._navigation = this._navigation.map(item => {
            item.isExpanded = false;
            return item;
        });
    }

    toggleMenu (): void {
        this.showMenu = !this.showMenu;
        this.updateMenuClasses();
    }

    get credits (): number {
        return this._authService.authUser.credits;
    }

    get avatar (): string {
        return `/resources/images/users/${this._authService.authUser.userId}.gif?${this._authService.authUser.avatarUpdatedAt}`;
    }

    get username (): string {
        return this._authService.authUser.nickname;
    }

    get thc (): number {
        return this._authService.authUser.credits;
    }

    get isLoggedIn (): boolean {
        return Boolean(this._user);
    }

    get nickname (): string {
        return this._user ? this._user.nickname : 'User';
    }

    get isSitecp (): boolean {
        return this._user && this._user.isSitecp;
    }

    get isStaff (): boolean {
        return this._user && this._user.isStaff;
    }

    get level (): number {
        return Math.floor(this._user.xp / XP_PER_LEVEL);
    }

    get percentage (): number {
        const currentXp = this._user.xp - (this.level * XP_PER_LEVEL);
        return Math.floor((currentXp / XP_PER_LEVEL) * 100);
    }

    get homePage (): string {
        return this.isLoggedIn && this._authService.authUser.homePage ?
            this._authService.authUser.homePage : 'home';
    }

    private getNavigation (json: string): Array<MainItem> {
        if (!json) {
            return [];
        }
        try {
            const navigation = JSON.parse(json);
            return Array.isArray(navigation) ? navigation.map(item => new MainItem(item)) : [];
        } catch (_e) {
            // Do nothing
        }
        return [];
    }

    private setUser (): void {
        this._user = this._authService.isLoggedIn() ? this._authService.authUser : null;
        this.routes = this._navigation
            .filter(item => item.loginRequired ? this._user : true);
    }

    private updateMenuClasses (): void {
        const classes = [];
        if (this.showMenu) {
            classes.push('menu-show');
        }
        if (this.isFixed) {
            classes.push('fixed-menu-margin');
        }
        this.menuClasses = classes.join(' ');
    }
}
