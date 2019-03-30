import { AuthService } from 'core/services/auth/auth.service';
import { Component } from '@angular/core';
import { RadioModel } from 'shared/components/radio/radio.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { Activity, ContinuesInformationModel } from 'core/services/continues-information/continues-information.model';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent {
    private _info: ContinuesInformationModel;

    isMenuFixed: boolean;

    constructor(
        private _authService: AuthService,
        continuesInformationService: ContinuesInformationService
    ) {
        continuesInformationService.onContinuesInformation.subscribe(continuesInformation => {
            this._info = continuesInformation;
        });
        this.isMenuFixed = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
    }

    get radioStats(): RadioModel {
        return this._info ? this._info.radio : null;
    }

    get activities(): Array<Activity> {
        return this._info ? this._info.activities : [];
    }

    get homePage(): string {
        return this._authService.isLoggedIn() && this._authService.authUser.homePage ?
            this._authService.authUser.homePage : '/home';
    }
}
