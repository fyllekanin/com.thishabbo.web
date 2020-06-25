import { Component, Input } from '@angular/core';
import { User } from 'core/services/auth/auth.model';
import { StringHelper } from 'shared/helpers/string.helper';
import { NAME_POSITIONS } from 'shared/constants/name-positions.constants';
import { AvatarModel } from '../../../pages/user/usercp/essentials/avatar/avatar.model';
import { UserHelper, UserStyle } from 'shared/helpers/user.helper';

@Component({
    selector: 'app-user-post-bit',
    templateUrl: 'user-post-bit.component.html',
    styleUrls: [ 'user-post-bit.component.css' ]
})
export class UserPostBitComponent {
    private _user = new User();
    private _previewAvatar: string;
    @Input()
    avatarSize = new AvatarModel(null);

    useAvatarImage = true;
    socials: Array<{ label: string, value: string }> = [];

    onAvatarError (): void {
        this.useAvatarImage = false;
    }

    getBarColors (): UserStyle {
        return UserHelper.getBarColor(this._user.barColor);
    }

    @Input()
    set user (user: User) {
        this._user = user;
        this.setSocials();
    }

    @Input()
    set previewAvatar(previewAvatar: string) {
        this._previewAvatar = previewAvatar;
        this.useAvatarImage = true;
    }

    get user (): User {
        return this._user;
    }

    get isTopOutside () {
        return this._user.namePosition === NAME_POSITIONS.TOP_OUTSIDE;
    }

    get isTopInside () {
        return this._user.namePosition === NAME_POSITIONS.TOP_INSIDE;
    }

    get isBottomOutside () {
        return this._user.namePosition === NAME_POSITIONS.BOTTOM_OUTSIDE;
    }

    get isBottomInside () {
        return this._user.namePosition === NAME_POSITIONS.BOTTOM_INSIDE;
    }

    get userAvatarUrl (): string {
        return this._previewAvatar || `/resources/images/users/${this._user.userId}.gif?${this._user.avatarUpdatedAt}`;
    }

    get width (): string {
        return this.avatarSize.width ? `${this.avatarSize.width}px` : 'auto';
    }

    get height (): string {
        return this.avatarSize.height ? `${this.avatarSize.height}px` : 'auto';
    }

    private setSocials (): void {
        this.socials = !this._user.social ?
            [] : Object.keys(this._user.social).map(key => {
                return {
                    label: StringHelper.firstCharUpperCase(key),
                    value: this._user.social[key]
                };
            }).filter(item => item.value);
    }
}
