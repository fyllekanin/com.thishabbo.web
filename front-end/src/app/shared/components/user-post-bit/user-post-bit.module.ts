import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLinkModule } from 'shared/components/user/user-link.module';
import { UserPostBitComponent } from 'shared/components/user-post-bit/user-post-bit.component';
import { LazyLoadModule } from 'shared/directives/lazy-load/lazy-load.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';

@NgModule({
    imports: [
        CommonModule,
        UserLinkModule,
        LazyLoadModule,
        SafeHtmlModule,
        SafeStyleModule
    ],
    declarations: [
        UserPostBitComponent
    ],
    exports: [
        UserPostBitComponent
    ]
})
export class UserPostBitModule {
}