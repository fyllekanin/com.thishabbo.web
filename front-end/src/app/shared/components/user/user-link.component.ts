import { Component, Input } from '@angular/core';
import { SlimUser } from 'core/services/auth/auth.model';
import { UserHelper } from 'shared/helpers/user.helper';
import { TimeHelper } from 'shared/helpers/time.helper';

@Component({
    selector: 'app-user-link',
    templateUrl: 'user-link.component.html',
    styleUrls: ['user-link.component.css']
})
export class UserLinkComponent {
    @Input() user = new SlimUser();

    get nameStyling (): string {
        return this.user ? this.user.nameStyling : '';
    }

    get avatarUrl (): string {
        return `background-image: url('/rest/resources/images/users/${this.user.userId}.gif')`;
    }

    get coverUrl (): string {
        return `background-image: url('/rest/resources/images/covers/${this.user.userId}');`;
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

