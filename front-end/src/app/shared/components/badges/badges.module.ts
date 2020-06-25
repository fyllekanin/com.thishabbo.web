import { NgModule } from '@angular/core';
import { BadgesComponent } from 'shared/components/badges/badges.component';
import { TitleModule } from 'shared/app-views/title/title.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { CommonModule } from '@angular/common';
import { HabboBadgeModule } from 'shared/directives/habbo-badge/habbo-badge.module';

@NgModule({
    imports: [
        TitleModule,
        ContentModule,
        CommonModule,
        HabboBadgeModule
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
