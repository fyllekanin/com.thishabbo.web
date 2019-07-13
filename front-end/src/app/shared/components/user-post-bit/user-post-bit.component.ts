import { Component, HostListener, Input } from '@angular/core';
import { User, UserBadge } from 'core/services/auth/auth.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { StringHelper } from 'shared/helpers/string.helper';
import { NAME_POSITIONS } from 'shared/constants/name-positions.constants';
import { AvatarModel } from '../../../pages/user/usercp/essentials/avatar/avatar.model';
import { UserHelper } from 'shared/helpers/user.helper';

@Component({
    selector: 'app-user-post-bit',
    templateUrl: 'user-post-bit.component.html',
    styleUrls: ['user-post-bit.component.css']
})
export class UserPostBitComponent {
    private _user = new User();
    @Input()
    avatarSize = new AvatarModel(null);
    @Input()
    previewAvatar: string;

    useAvatarImage = true;
    isMobile = false;
    socials: Array<{ label: string, value: string }> = [];

    onAvatarError (): void {
        this.useAvatarImage = false;
    }

    longDay (time: number): string {
        return TimeHelper.getLongDate(time);
    }

    badgeTooltip (badge: UserBadge): string {
        return `${badge.name}: ${badge.description}`;
    }

    getBarColors (): string {
        return UserHelper.getBarColor(this._user.barColor);
    }

    @HostListener('window:resize', ['$event'])
    onResize (event) {
        this.isMobile = event.target.innerWidth <= 600;
    }

    @Input()
    set user (user: User) {
        this._user = user;
        this.setSocials();
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
        return this.previewAvatar || `/rest/resources/images/users/${this._user.userId}.gif?${this._user.avatarUpdatedAt}`;
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
