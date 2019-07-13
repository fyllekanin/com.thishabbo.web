import { AuthService } from 'core/services/auth/auth.service';
import { Component, HostListener } from '@angular/core';
import { EventsModel, RadioModel } from 'shared/components/radio/radio.model';
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

    isMobile = false;
    isMenuFixed: boolean;
    isMinimalistic: boolean;

    constructor (
        private _authService: AuthService,
        continuesInformationService: ContinuesInformationService
    ) {
        this.isMenuFixed = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
        this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        continuesInformationService.onContinuesInformation.subscribe(continuesInformation => {
            this._info = continuesInformation;
        });
        continuesInformationService.onDeviceSettingsUpdated.subscribe(() => {
            this.isMenuFixed = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
            this.isMinimalistic = Boolean(localStorage.getItem(LOCAL_STORAGE.MINIMALISTIC));
        });
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.isMobile = event.target.innerWidth <= 600;
    }


    get radioStats (): RadioModel {
        return this._info ? this._info.radio : null;
    }

    get eventStats (): EventsModel {
        return this._info ? this._info.events : null;
    }

    get activities (): Array<Activity> {
        return this._info ? this._info.activities : [];
    }

    get isLoggedIn (): boolean {
        return this._authService.isLoggedIn();
    }

    get homePage (): string {
        return this._authService.isLoggedIn() && this._authService.authUser.homePage ?
            this._authService.authUser.homePage : '/home';
    }
}
