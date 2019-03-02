import { FormsModule } from '@angular/forms';
import { PageModule } from 'shared/page/page.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { customRoutes } from './custom.routes';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LazyLoadModule } from 'shared/directives/lazy-load/lazy-load.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { CustomPageResolver } from './services/custom-page.resolver';

@NgModule({
    imports: [
        RouterModule.forChild(customRoutes),
        TitleModule,
        ContentModule,
        PageModule,
        FormsModule,
        CommonModule,
        LazyLoadModule,
        SafeStyleModule,
        SafeHtmlModule
    ],
    declarations: [
        CustomPageComponent
    ],
    providers: [
        CustomPageResolver
    ],
    exports: [
        RouterModule
    ]
})

export class CustomModule {
}
