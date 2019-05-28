import { Component, Input } from '@angular/core';
import { SlimUser } from 'core/services/auth/auth.model';
import { UserHelper } from 'shared/helpers/user.helper';

@Component({
    selector: 'app-user-link',
    templateUrl: 'user-link.component.html'
})
export class UserLinkComponent {
    @Input() user = new SlimUser();

    get nameStyling (): string {
        return UserHelper.getNameColour(this.user.nameColour);
    }
}

