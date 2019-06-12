import { Component } from '@angular/core';
import { ActiveUser, ContinuesInformationModel } from 'core/services/continues-information/continues-information.model';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.css']
})

export class FooterComponent {
    private _info: ContinuesInformationModel;

    constructor(
        private _router: Router,
        continuesInformationService: ContinuesInformationService
    ) {
        continuesInformationService.onContinuesInformation.subscribe(continuesInformation => {
            this._info = continuesInformation;
        });
    }

    get activeUsers (): Array<ActiveUser> {
        return this._info.activeUsers;
    }

    getAvatarUrl (id: number): string {
        return `background-image: url('/rest/resources/images/users/${id}.gif')`;
    }

    goToProfile (nickname: string) {
        this._router.navigateByUrl(`user/profile/${nickname}`);
    }

}
