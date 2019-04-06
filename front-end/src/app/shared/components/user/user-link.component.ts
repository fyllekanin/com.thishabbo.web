import { Component, Input } from '@angular/core';
import { SlimUser } from 'core/services/auth/auth.model';

@Component({
    selector: 'app-user-link',
    templateUrl: 'user-link.component.html'
})
export class UserLinkComponent {
    @Input() user = new SlimUser();
}

