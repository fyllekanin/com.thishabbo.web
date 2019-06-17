import { Component, Input } from '@angular/core';
import { SlimUser } from 'core/services/auth/auth.model';
import { UserHelper } from 'shared/helpers/user.helper';

@Component({
    selector: 'app-user-link',
    templateUrl: 'user-link.component.html',
    styleUrls: ['user-link.component.css']
})
export class UserLinkComponent {
    @Input() user = new SlimUser();

    get nameStyling (): string {
        return UserHelper.getNameColor(this.user.nameColor);
    }

    get iconImage (): string {
        return this.user.iconId ? `/rest/resources/images/shop/${this.user.iconId}.gif` : null;
    }

    get iconPosition (): string {
        return this.user.iconPosition || 'left';
    }

    get effect (): string {
        return this.user.effectId ? `url(/rest/resources/images/shop/${this.user.effectId}.gif)` : '';
    }
}

