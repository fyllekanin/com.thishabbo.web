import { NgModule } from '@angular/core';
import { FooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { CommonModule } from '@angular/common';
import { UserProfileModule } from 'shared/directives/user-profile.module';
import { UserLinkModule } from 'shared/components/user/user-link.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SafeStyleModule,
        UserProfileModule,
        UserLinkModule
    ],
    declarations: [
        FooterComponent
    ],
    exports: [
        FooterComponent
    ]
})
export class FooterModule {
}
