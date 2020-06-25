import { AuthService } from 'core/services/auth/auth.service';
import { Component } from '@angular/core';
import { MainItem } from 'shared/app-views/navigation/navigation.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-navigation',
    templateUrl: 'navigation.component.html',
    styleUrls: [ 'navigation.component.css' ]
})
export class NavigationComponent {
    private _navigation: Array<MainItem> = [];

    routes: Array<MainItem> = [];

    constructor (private _authService: AuthService) {
        const navigation = localStorage.getItem(LOCAL_STORAGE.NAVIGATION);
        this._navigation = this.getNavigation(navigation);
        this.routes = this.getRoutes();
        this._authService.onUserChange.subscribe(() => {
            this.routes = this.getRoutes();
        });
    }

    logout (): void {
        this._authService.logout(false);
    }

    get isLoggedIn (): boolean {
        return this._authService.isLoggedIn();
    }

    get homePage (): string {
        return this.isLoggedIn ? this._authService.authUser.homePage || 'home' : 'home';
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

    private getRoutes (): Array<MainItem> {
        return this._navigation
            .filter(item => !item.isLogout)
            .filter(item => item.loginRequired ? this._authService.isLoggedIn() : true);
    }
}
