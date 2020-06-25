import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { UserLinkModule } from 'shared/components/user/user-link.module';
import { SlimArticleComponent } from 'shared/components/slim-article/slim-article.component';
import { CommonModule } from '@angular/common';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { HabboBadgeModule } from 'shared/directives/habbo-badge/habbo-badge.module';

@NgModule({
    imports: [
        RouterModule,
        SafeHtmlModule,
        UserLinkModule,
        CommonModule,
        SafeStyleModule,
        HabboBadgeModule
    ],
    declarations: [
        SlimArticleComponent
    ],
    exports: [
        SlimArticleComponent
    ]
})
export class SlimArticleModule {
}
