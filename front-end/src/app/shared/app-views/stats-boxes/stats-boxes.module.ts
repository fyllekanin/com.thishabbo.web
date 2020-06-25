import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentModule } from 'shared/app-views/content/content.module';
import { StatsBoxesComponent } from 'shared/app-views/stats-boxes/stats-boxes.component';
import { SafeHtmlModule } from 'shared/pipes/safe-html/safe-html.module';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { HabboBadgeModule } from 'shared/directives/habbo-badge/habbo-badge.module';

@NgModule({
    imports: [
        CommonModule,
        ContentModule,
        SafeHtmlModule,
        SafeStyleModule,
        HabboBadgeModule
    ],
    declarations: [
        StatsBoxesComponent
    ],
    exports: [
        StatsBoxesComponent
    ]
})
export class StatsBoxesModule {
}
