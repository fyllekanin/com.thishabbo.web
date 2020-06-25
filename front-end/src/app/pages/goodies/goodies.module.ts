import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageModule } from 'shared/page/page.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { RouterModule } from '@angular/router';
import { goodiesRoutes } from './goodies.routes';
import { HabboImagerComponent } from './habbo-imager/habbo-imager.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        RouterModule.forChild(goodiesRoutes),
        CommonModule,
        PageModule,
        TitleModule,
        ContentModule,
        FormsModule
    ],
    declarations: [
        HabboImagerComponent
    ],
    providers: [],
    exports: [
        RouterModule
    ]
})
export class GoodiesModule {
}
