import { Component, Input } from '@angular/core';
import { User } from 'core/services/auth/auth.model';
import { TimeHelper } from 'shared/helpers/time.helper';
import { StringHelper } from 'shared/helpers/string.helper';
import { NAME_POSITIONS } from 'shared/constants/name-positions.constants';

@Component({
    selector: 'app-user-post-bit',
    templateUrl: 'user-post-bit.component.html',
    styleUrls: ['user-post-bit.component.css']
})
export class UserPostBitComponent {
    @Input()
    user: User;

    useAvatarImage = true;

    onAvatarError (): void {
        this.useAvatarImage = false;
    }

    longDay (time: number): string {
        return TimeHelper.getLongDate(time);
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
        return `/rest/resources/images/users/${this.user.userId}.gif?${this.user.avatarUpdatedAt}`;
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
}