import { Component, Input } from '@angular/core';
import { User, UserBadge } from 'core/services/auth/auth.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { StringHelper } from 'shared/helpers/string.helper';
import { NAME_POSITIONS } from 'shared/constants/name-positions.constants';
import { AvatarModel } from '../../../pages/user/usercp/essentials/avatar/avatar.model';
import { UserHelper } from 'shared/helpers/user.helper';
import { ThemeHelper } from 'shared/helpers/theme.helper';

@Component({
    selector: 'app-user-post-bit',
    templateUrl: 'user-post-bit.component.html',
    styleUrls: ['user-post-bit.component.css']
})
export class UserPostBitComponent {
    @Input()
    user = new User();
    @Input()
    avatarSize = new AvatarModel(null);
    @Input()
    previewAvatar: string;

    useAvatarImage = true;

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
        return UserHelper.getBarColor(this.user.barColor);
    }

    get isTopOutside () {
        return this.user.namePosition === NAME_POSITIONS.TOP_OUTSIDE;
    }

    get isTopInside () {
        return this.user.namePosition === NAME_POSITIONS.TOP_INSIDE;
    }

    get isBottomOutside () {
        return this.user.namePosition === NAME_POSITIONS.BOTTOM_OUTSIDE;
    }

    get isBottomInside () {
        return this.user.namePosition === NAME_POSITIONS.BOTTOM_INSIDE;
    }

    get userAvatarUrl (): string {
        return this.previewAvatar || `/rest/resources/images/users/${this.user.userId}.gif?${this.user.avatarUpdatedAt}`;
    }

    get socials (): Array<{ label: string, value: string }> {
        return !this.user.social ?
            [] : Object.keys(this.user.social).map(key => {
                return {
                    label: StringHelper.firstCharUpperCase(key),
                    value: this.user.social[key]
                };
            }).filter(item => item.value);
    }

    get width (): string {
        return this.avatarSize.width ? `${this.avatarSize.width}px` : 'auto';
    }

    get height (): string {
        return this.avatarSize.height ? `${this.avatarSize.height}px` : 'auto';
    }

    get isMobile (): boolean {
        return ThemeHelper.isMobile();
    }
}
