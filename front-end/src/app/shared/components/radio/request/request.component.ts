import { Component } from '@angular/core';
import { InnerDialogComponent } from 'shared/app-views/dialog/dialog.model';

@Component({
    selector: 'app-radio-request',
    templateUrl: 'request.component.html',
    styleUrls: ['request.component.css']
})
export class RequestComponent extends InnerDialogComponent {
    private _isLoggedIn: boolean;

    content = '';
    nickname = '';

    setData(isLoggedIn: boolean) {
        this._isLoggedIn = isLoggedIn;
    }

    getData() {
        return {
            content: this.content,
            nickname: this.nickname
        };
    }

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }
}
