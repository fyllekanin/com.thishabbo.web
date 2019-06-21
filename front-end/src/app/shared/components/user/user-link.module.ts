import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { UserLinkComponent } from 'shared/components/user/user-link.component';
import { MiniProfileComponent } from './mini-profile/mini-profile.component';

@NgModule({
    imports: [
        RouterModule,
        SafeStyleModule,
        SafeHtmlModule
    ],
    declarations: [
        UserLinkComponent,
        MiniProfileComponent
    ],
    exports: [
        UserLinkComponent
    ],
    entryComponents: [
        MiniProfileComponent
    ]
})
export class UserLinkModule {}
