import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { UserLinkComponent } from 'shared/components/user/user-link.component';

@NgModule({
    imports: [
        RouterModule,
        SafeStyleModule,
        SafeHtmlModule
    ],
    declarations: [
        UserLinkComponent
    ],
    exports: [
        UserLinkComponent
    ]
})
export class UserLinkModule {}
