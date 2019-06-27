import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'core/services/auth/auth.service';

@Injectable()
export class HomePageGuard implements CanActivate {

    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
    }

    canActivate(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this._authService.isLoggedIn()) {
                this._router.navigateByUrl(this._authService.getAuthUser().homePage)
                    .catch(() => {
                        this._router.navigateByUrl('/home');
                    });
            } else {
                this._router.navigateByUrl('/home');
            }
            resolve(false);
        });
    }
}
