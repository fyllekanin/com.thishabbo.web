import { NgModule } from '@angular/core';
import { BadgesComponent } from 'shared/components/badges/badges.component';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        TitleModule,
        ContentModule,
        CommonModule
    ],
    declarations: [
        BadgesComponent
    ],
    exports: [
        BadgesComponent
    ]
})
export class BadgesModule {
}
