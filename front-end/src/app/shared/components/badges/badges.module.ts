import { NgModule } from '@angular/core';
import { BadgesComponent } from 'shared/components/badges/badges.component';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { CommonModule } from '@angular/common';
import { LazyLoadModule } from 'shared/directives/lazy-load/lazy-load.module';

@NgModule({
    imports: [
        TitleModule,
        ContentModule,
        CommonModule,
        LazyLoadModule
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
