import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { LazyLoadModule } from 'shared/directives/lazy-load/lazy-load.module';
import { UserLinkModule } from 'shared/components/user/user-link.module';
import { SlimArticleComponent } from 'shared/components/slim-article/slim-article.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        RouterModule,
        SafeHtmlModule,
        LazyLoadModule,
        UserLinkModule,
        CommonModule
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
