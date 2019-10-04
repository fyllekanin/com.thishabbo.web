import { AuthService } from 'core/services/auth/auth.service';
import { Component } from '@angular/core';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { ContinuesInformationModel } from 'core/services/continues-information/continues-information.model';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: [ 'header.component.css' ]
})
export class HeaderComponent {
    info = new ContinuesInformationModel();
    isMenuFixed: boolean;
    isMinimalistic: boolean;

    constructor (
        private _authService: AuthService,
        continuesInformationService: ContinuesInformationService
    ) {
        this.isMenuFixed = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
        this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        continuesInformationService.onContinuesInformation.subscribe(continuesInformation => {
            this.info = continuesInformation;
        });
        continuesInformationService.onDeviceSettingsUpdated.subscribe(() => {
            this.isMenuFixed = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
            this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        });
    }

    get isLoggedIn (): boolean {
        return this._authService.isLoggedIn();
    }

    get homePage (): string {
        return this._authService.isLoggedIn() && this._authService.authUser.homePage ?
            this._authService.authUser.homePage : '/home';
    }
}
