import { /* Router, */CanActivate } from "@angular/router";
import { Injectable } from "@angular/core";
// import { AuthService } from "../auth.service";

@Injectable({
    providedIn: 'root',
})
export class HomePageGuard implements CanActivate  {

    /*constructor(
        private _router: Router,
        private _authService: AuthService
    ) {} */

    /*canActivate() : boolean {
        console.log("checking");
        if (this._authService.authUser && this._authService.authUser.homePage) {
            this._router.navigateByUrl(this._authService.authUser.homePage);
            return false;
        } else {
            return true;
        }
    }*/

    canActivate(): boolean {
        console.log("entered guard");
        return true;
    }
}