import { UserProfileDirective } from 'shared/directives/user-profile.directive';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
        UserProfileDirective
    ],
    exports: [
        UserProfileDirective
    ]
})
export class UserProfileModule {}
