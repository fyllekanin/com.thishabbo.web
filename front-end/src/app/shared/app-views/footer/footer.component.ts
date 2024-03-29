import { AfterViewInit, Component } from '@angular/core';
import {
    ActiveUser,
    ContinuesInformationModel,
    MonthInformation
} from 'core/services/continues-information/continues-information.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrls: [ 'footer.component.css' ]
})

export class FooterComponent implements AfterViewInit {
    private _info: ContinuesInformationModel;

    constructor (
        private _router: Router,
        private _continuesInformationService: ContinuesInformationService
    ) {
    }

    ngAfterViewInit (): void {
        this._continuesInformationService.onContinuesInformation
            .subscribe(continuesInformation => this._info = continuesInformation);
    }

    get activeUsers (): Array<ActiveUser> {
        return this._info ? this._info.footer.activeUsers : null;
    }

    get month (): MonthInformation {
        return this._info ? this._info.footer.month : null;
    }

    trackUsers (_index: number, item: ActiveUser): number {
        return item.userId;
    }

    goToProfile (nickname: string) {
        this._router.navigateByUrl(`user/profile/${nickname}`);
    }

    clearUserCache (): void {
        localStorage.clear();
        location.reload();
    }
}
