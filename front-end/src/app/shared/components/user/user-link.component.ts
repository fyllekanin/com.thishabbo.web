import { Component, Input } from '@angular/core';
import { SlimUser } from 'core/services/auth/auth.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { LOCAL_STORAGE } from 'shared/constants/local-storage.constants';

@Component({
    selector: 'app-user-link',
    templateUrl: 'user-link.component.html',
    styleUrls: ['user-link.component.css']
})
export class UserLinkComponent {
    private _user: SlimUser = new SlimUser();

    @Input() isMiniProfileDisabled = false;

    constructor () {
        this.isMiniProfileDisabled = this.isMiniProfileDisabled || Boolean(localStorage.getItem(LOCAL_STORAGE.MINI_PROFILE_DISABLED));
    }

    set user (user: SlimUser) {
        if (user) {
            this._user = user;
        }
    }

    get user (): SlimUser {
        return this._user;
    }

    get nameStyling (): string {
        return this.user ? this.user.nameStyling : '';
    }

    get avatarUrl (): string {
        return `url('/rest/resources/images/users/${this.user.userId}.gif?${this.user.avatarUpdatedAt}')`;
    }

    get coverUrl (): string {
        return `url('/rest/resources/images/covers/${this.user.userId}.gif?${this.user.avatarUpdatedAt}')`;
    }

    get posts (): string {
        return this.user.posts < 1000 ? `${this.user.posts}` : `${this.user.posts / 1000}K`;
    }

    get likes (): string {
        return this.user.likes < 1000 ? `${this.user.likes}` : `${this.user.likes / 1000}K`;
    }

    get joinDate (): string {
        return TimeHelper.getLongDate(this.user.createdAt);
    }

    get iconImage (): string {
        return this.user && this.user.iconId ? `/rest/resources/images/shop/${this.user.iconId}.gif` : null;
    }

    get iconPosition (): string {
        return this.user && this.user.iconPosition ? this.user.iconPosition : 'left';
    }

    get effect (): string {
        return this.user && this.user.effectId ? `url(/rest/resources/images/shop/${this.user.effectId}.gif)` : '';
    }

    get nickname (): string {
        return this.user ? this.user.nickname : '';
    }
}

