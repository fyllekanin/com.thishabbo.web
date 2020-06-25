import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SlimUser } from 'core/services/auth/auth.model';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';
import { UserStyle } from 'shared/helpers/user.helper';

@Component({
    selector: 'app-user-link',
    templateUrl: 'user-link.component.html',
    styleUrls: [ 'user-link.component.css' ]
})
export class UserLinkComponent {
    private _user = new SlimUser();

    @ViewChild('miniNickname') miniNickname: ElementRef;
    @ViewChild('mainNickname') mainNickname: ElementRef;

    @Input() isMiniProfileDisabled = false;
    posts: string;
    likes: string;

    constructor () {
        this.isMiniProfileDisabled = this.isMiniProfileDisabled || Boolean(localStorage.getItem(LOCAL_STORAGE.MINI_PROFILE_DISABLED));
    }

    @Input()
    set user (user: SlimUser) {
        if (!user) {
            return;
        }
        this._user = user;
        this.posts = this.user.posts < 1000 ? `${this.user.posts}` : `${this.user.posts / 1000}K`;
        this.likes = this.user.likes < 1000 ? `${this.user.likes}` : `${this.user.likes / 1000}K`;
    }

    get user (): SlimUser {
        return this._user;
    }

    get nameStyle (): UserStyle {
        return this._user.nameStyling;
    }
}

