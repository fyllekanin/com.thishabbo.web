import { AuthService } from 'core/services/auth/auth.service';
import { Component } from '@angular/core';
import { RadioModel } from 'shared/components/radio/radio.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { Activity, ContinuesInformationModel } from 'core/services/continues-information/continues-information.model';
import { Router } from '@angular/router';
import { NotificationService } from 'core/services/notification/notification.service';
import { NotificationMessage, NotificationType } from 'shared/app-views/global-notification/global-notification.model';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent {
    private _info: ContinuesInformationModel;

    text: string;
    isMenuFixed: boolean;

    constructor(
        private _router: Router,
        private _notificationService: NotificationService,
        private _authService: AuthService,
        continuesInformationService: ContinuesInformationService
    ) {
        continuesInformationService.onContinuesInformation.subscribe(continuesInformation => {
            this._info = continuesInformation;
        });
        this.isMenuFixed = Boolean(localStorage.getItem(LOCAL_STORAGE.FIXED_MENU));
    }

    onKeyUp(event): void {
        if (event.keyCode === 13) {
            this.goToSearch();
        }
    }

    goToSearch(): void {
        if (!this.text) {
            this._notificationService.sendNotification(new NotificationMessage({
                title: 'Error',
                message: 'You need to specify what you want to search first!',
                type: NotificationType.ERROR
            }));
            return;
        }

        this.text = '';
        this._router.navigateByUrl(this._router.createUrlTree(
            ['/home/search/threads/page/1'], { queryParams: { text: this.text }}
        ));
    }

    goToAdvancedSearch(): void {
        this._router.navigateByUrl('/home/search/threads/page/1');
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
