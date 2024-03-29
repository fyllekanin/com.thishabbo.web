import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLinkModule } from 'shared/components/user/user-link.module';
import { UserPostBitComponent } from 'shared/components/user-post-bit/user-post-bit.component';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { ImageLazyLoadModule } from 'shared/directives/image-lazy-load/image-lazy-load.module';

@NgModule({
    imports: [
        CommonModule,
        UserLinkModule,
        SafeHtmlModule,
        SafeStyleModule,
        ImageLazyLoadModule
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
