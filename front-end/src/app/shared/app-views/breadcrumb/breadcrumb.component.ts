import { Component } from '@angular/core';
import { Breadcrumb, BreadcrumbItem } from 'core/services/breadcrum/breadcrum.model';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { RouterStateService } from 'core/services/router/router-state.service';
import { AuthService } from 'core/services/auth/auth.service';


@Component({
    selector: 'app-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
    styleUrls: ['breadcrumb.component.css']
})

export class BreadcrumbComponent {
    private _breadcrumb: Breadcrumb;

    constructor (
        private _routerStateService: RouterStateService,
        private _authService: AuthService,
        breadcrumbService: BreadcrumbService,
    ) {
        breadcrumbService.onBreadcrumb.subscribe(breadcrumb => {
            this._breadcrumb = breadcrumb;
            this._routerStateService.updateCurrentPage(this._breadcrumb.current);
        });
    }

    get homePage (): Array<string> {
        const homePage = this._authService.isLoggedIn() && this._authService.authUser.homePage ?
            this._authService.authUser.homePage : '/home';
        return [homePage];
    }

    get breadcrumbItems (): Array<BreadcrumbItem> {
        return this._breadcrumb ? this._breadcrumb.items : [];
    }

    get current (): string {
        return this._breadcrumb ? this._breadcrumb.current : '';
    }
}
