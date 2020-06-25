import { Component } from '@angular/core';
import { AuthService } from 'core/services/auth/auth.service';
import { TitleTab, TitleTopBorder } from 'shared/app-views/title/title.model';
import { INFO_BOX_TYPE, InfoBoxModel } from 'shared/app-views/info-box/info-box.model';
import { StringHelper } from 'shared/helpers/string.helper';

@Component({
    selector: 'app-home-login-box',
    templateUrl: 'login-box.component.html',
    styleUrls: [ 'login-box.component.css' ]
})
export class LoginBoxComponent {

    titleTop = TitleTopBorder.RED;
    loginName: string;
    password: string;
    tabs: Array<TitleTab> = [
        new TitleTab({ title: 'Login' }),
        new TitleTab({ title: 'Register', link: '/auth/register' })
    ];

    infoModel: InfoBoxModel = {
        title: 'Warning!',
        type: INFO_BOX_TYPE.WARNING,
        content: `Most passwords &amp; nicknames have been reset prior to VX.
        <br><br>
        If you have problems logging in, please click <strong>here</strong> and we'll get you sorted in no time!
        `
    };

    constructor (
        private _authService: AuthService
    ) {
    }

    doLogin (): void {
        this._authService.login(this.loginName, this.password);
    }

    keyDownFunction (event): void {
        if (StringHelper.isKey(event, 'enter')) {
            this.doLogin();
        }
    }
}
